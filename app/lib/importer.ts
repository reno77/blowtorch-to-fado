// This module handles the client-side SQLite database manipulation
// Using sql.js which runs entirely in the browser

export interface Alias {
  name: string
  todo: string
  enabled: number
  partialMatch: number
}

export interface Trigger {
  name: string
  regexp: string
  todo: string
  enabled: number
  useRegexp: number
}

export interface Connection {
  id: number
  display_name: string
  host_name: string
  port_number: number
}

export interface ImportResult {
  aliasesImported: number
  triggersImported: number
  dbBuffer: Uint8Array
}

export function parseXML(xmlText: string): { aliases: Alias[]; triggers: Trigger[] } {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

  // Check for parse errors
  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Invalid XML file')
  }

  // Parse aliases
  const aliases: Alias[] = []
  const aliasElements = xmlDoc.querySelectorAll('aliases > alias')
  
  aliasElements.forEach((alias) => {
    const pre = alias.getAttribute('pre') || ''
    const post = alias.getAttribute('post') || ''
    const enabled = alias.getAttribute('enabled') !== 'false'
    
    if (pre && post) {
      aliases.push({
        name: pre,
        todo: post,
        enabled: enabled ? 1 : 0,
        partialMatch: 0,
      })
    }
  })

  // Parse triggers
  const triggers: Trigger[] = []
  const triggerElements = xmlDoc.querySelectorAll('triggers > trigger')
  
  triggerElements.forEach((trigger) => {
    const title = trigger.getAttribute('title') || ''
    const pattern = trigger.getAttribute('pattern') || ''
    const enabled = trigger.getAttribute('enabled') !== 'false'
    
    // Get the action (ack with attribute)
    const ackElement = trigger.querySelector('ack')
    const action = ackElement?.getAttribute('with') || ''
    
    if (title && pattern && action) {
      triggers.push({
        name: title,
        regexp: pattern,
        todo: action,
        enabled: enabled ? 1 : 0,
        useRegexp: 0,
      })
    }
  })

  return { aliases, triggers }
}

export async function getConnections(dbBuffer: ArrayBuffer): Promise<Connection[]> {
  // Dynamically import sql.js (runs in browser)
  const initSqlJs = (await import('sql.js')).default
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`
  })

  // Load the database
  const db = new SQL.Database(new Uint8Array(dbBuffer))

  try {
    // Check if Connection table exists
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='Connections'")
    
    if (!tables.length || !tables[0]?.values.length) {
      db.close()
      throw new Error('Connection table not found in database')
    }

    // Get all connections
    const result = db.exec('SELECT id, display_name, host_name, port_number FROM Connections ORDER BY sort_order, display_name')
    
    if (!result.length || !result[0]?.values.length) {
      db.close()
      throw new Error('No connections found in database')
    }

    const connections: Connection[] = result[0].values.map(row => ({
      id: row[0] as number,
      display_name: row[1] as string,
      host_name: row[2] as string,
      port_number: row[3] as number,
    }))

    db.close()
    return connections
  } catch (error) {
    db.close()
    throw error
  }
}

export async function importToDatabase(
  dbBuffer: ArrayBuffer,
  aliases: Alias[],
  triggers: Trigger[],
  connectionId: number
): Promise<ImportResult> {
  // Dynamically import sql.js (runs in browser)
  const initSqlJs = (await import('sql.js')).default
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`
  })

  // Load the database
  const db = new SQL.Database(new Uint8Array(dbBuffer))

  // Verify tables exist
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'")
  const tableNames = tables[0]?.values.flat() || []
  
  if (!tableNames.includes('Alias') || !tableNames.includes('Trigger')) {
    db.close()
    throw new Error('Database missing required tables (Alias or Trigger)')
  }

  // Get next IDs
  const aliasResult = db.exec('SELECT MAX(id) as maxId FROM Alias')
  const maxAliasId = aliasResult[0]?.values[0]?.[0] as number || 0
  let nextAliasId = maxAliasId + 1

  const triggerResult = db.exec('SELECT MAX(id) as maxId FROM Trigger')
  const maxTriggerId = triggerResult[0]?.values[0]?.[0] as number || 0
  let nextTriggerId = maxTriggerId + 1

  // Import aliases
  let aliasesImported = 0
  for (const alias of aliases) {
    try {
      db.run(
        'INSERT INTO Alias (id, connection_id, name, todo, partialMatch) VALUES (?, ?, ?, ?, ?)',
        [nextAliasId, connectionId, alias.name, alias.todo, alias.partialMatch]
      )
      nextAliasId++
      aliasesImported++
    } catch (error) {
      console.error(`Failed to import alias ${alias.name}:`, error)
    }
  }

  // Import triggers
  let triggersImported = 0
  for (const trigger of triggers) {
    try {
      db.run(
        'INSERT INTO Trigger (id, connection_id, name, enabled, regexp, todo, use_regexp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nextTriggerId, connectionId, trigger.name, trigger.enabled, trigger.regexp, trigger.todo, trigger.useRegexp]
      )
      nextTriggerId++
      triggersImported++
    } catch (error) {
      console.error(`Failed to import trigger ${trigger.name}:`, error)
    }
  }

  // Export the updated database
  const exportedDb = db.export()
  db.close()

  return {
    aliasesImported,
    triggersImported,
    dbBuffer: exportedDb,
  }
}
