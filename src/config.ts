import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

// Default configuration
const defaultConfig: Config = {
  dbUrl: "postgresql://username:password@localhost:5432/mydatabase",
  currentUserName: "default_user",
};

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}

function configFileExists(): boolean {
  const fullPath = getConfigFilePath();
  return fs.existsSync(fullPath);
}

function createDefaultConfig(): void {
  const fullPath = getConfigFilePath();

  const rawConfig = {
    db_url: defaultConfig.dbUrl,
    current_user_name: defaultConfig.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
  console.log(`Created default config file at: ${fullPath}`);
}

export function readConfig(): Config {
  const fullPath = getConfigFilePath();

  // Create default config if file doesn't exist
  if (!configFileExists()) {
    createDefaultConfig();
  }

  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);

  return validateConfig(rawConfig);
}

function getConfigFilePath() {
  const configFileName = ".gatorconfig.json";
  const homeDir = os.homedir();
  return path.join(homeDir, configFileName);
}

function writeConfig(config: Config) {
  const fullPath = getConfigFilePath();

  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
}

// Optional: Export a function to get config file path for debugging
export function getConfigPath(): string {
  return getConfigFilePath();
}
