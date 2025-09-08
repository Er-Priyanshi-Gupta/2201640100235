interface LoggerConfig {
  email: string
  name: string
  rollNo: string
  accessCode: string
  clientID: string
  clientSecret: string
  accessToken: string
  logID: string
}

interface LogEntry {
  level: "info" | "error" | "warn" | "debug"
  message: string
  timestamp: string
  component?: string
  metadata?: Record<string, any>
}

class Logger {
  private config: LoggerConfig
  private baseUrl = "http://20.244.56.144/evaluation-service"

  constructor(config: LoggerConfig) {
    this.config = config
  }

  private async sendLog(entry: LogEntry): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          ...entry,
          clientID: this.config.clientID,
          email: this.config.email,
          rollNo: this.config.rollNo,
          logID: this.config.logID,
        }),
      })

      if (!response.ok) {
        // Fallback to console if logging service fails
        console.error("Logging service failed:", entry)
      }
    } catch (error) {
      // Fallback to console if network fails
      console.error("Failed to send log:", entry, error)
    }
  }

  info(message: string, component?: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      component,
      metadata,
    }
    this.sendLog(entry)
  }

  error(message: string, component?: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      component,
      metadata,
    }
    this.sendLog(entry)
  }

  warn(message: string, component?: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      component,
      metadata,
    }
    this.sendLog(entry)
  }

  debug(message: string, component?: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      level: "debug",
      message,
      timestamp: new Date().toISOString(),
      component,
      metadata,
    }
    this.sendLog(entry)
  }
}

// Initialize logger with provided credentials
const loggerConfig: LoggerConfig = {
  email: "er.priyanshi.gupta.14@gmail.com",
  name: "priyanshi gupta",
  rollNo: "2201640100235",
  accessCode: "sAWTuR",
  clientID: "bcc94f4c-3325-4163-9df0-c799c674cde8",
  clientSecret: "qAKQgVaveEBUmmrB",
  accessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlci5wcml5YW5zaGkuZ3VwdGEuMTRAZ21haWwuY29tIiwiZXhwIjoxNzU3MzE5OTk5LCJpYXQiOjE3NTczMTkwOTksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJmZDg3NWU3Yy1lZGFiLTQyODctYjdmYS04N2ZiNzU1NTEyZmMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJwcml5YW5zaGkgZ3VwdGEiLCJzdWIiOiJiY2M5NGY0Yy0zMzI1LTQxNjMtOWRmMC1jNzk5YzY3NGNkZTgifSwiZW1haWwiOiJlci5wcml5YW5zaGkuZ3VwdGEuMTRAZ21haWwuY29tIiwibmFtZSI6InByaXlhbnNoaSBndXB0YSIsInJvbGxObyI6IjIyMDE2NDAxMDAyMzUiLCJhY2Nlc3NDb2RlIjoic0FXVHVSIiwiY2xpZW50SUQiOiJiY2M5NGY0Yy0zMzI1LTQxNjMtOWRmMC1jNzk5YzY3NGNkZTgiLCJjbGllbnRTZWNyZXQiOiJxQUtRZ1ZhdmVFQlVtbXJCIn0.aTeu2_92GQOx_Mw7TOOerEXlrJ5Jx2Piy5_xVOdQatc",
  logID: "e86c2864-e2bd-40ce-886f-25bbf6d747d5",
}

export const logger = new Logger(loggerConfig)
