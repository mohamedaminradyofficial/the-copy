# Firebase Studio configuration for The Copy - Arabic Drama Analysis Platform
{ pkgs, ... }: {
  # Which nixpkgs channel to use
  channel = "stable-23.11";
  
  # System packages needed for the project
  packages = [
    pkgs.nodejs_20
    pkgs.git
    pkgs.curl
    pkgs.wget
    pkgs.unzip
  ];
  
  # Environment variables
  env = {
    NODE_ENV = "development";
    FRONTEND_PORT = "9002";
    BACKEND_PORT = "3001";
  };
  
  idx = {
    # IDE extensions for the project
    extensions = [
      # AI & Google Services
      "google.gemini-cli-vscode-ide-companion"
      
      # TypeScript & JavaScript
      "ms-vscode.vscode-typescript-next"
      "bradlc.vscode-tailwindcss"
      
      # React & Next.js
      "ms-vscode.vscode-json"
      "esbenp.prettier-vscode"
      "dbaeumer.vscode-eslint"
      
      # Testing
      "vitest.explorer"
      "ms-playwright.playwright"
      
      # Utilities
      "ms-vscode.vscode-json"
      "redhat.vscode-yaml"
      "ms-vscode.hexdump"
    ];
    
    # Workspace configuration
    workspace = {
      # Runs when workspace is first created
      onCreate = {
        setup-environment = "./.idx/setup-env.sh";
        install-root = "npm install";
        install-frontend = "cd frontend && npm install";
        install-backend = "cd backend && npm install";
      };
      
      # Runs when workspace starts
      onStart = {
        start-services = "./start-dev.sh";
      };
    };
    
    # Preview configuration
    previews = {
      enable = true;
      previews = {
        # Frontend preview
        frontend = {
          command = [
            "npm"
            "run"
            "dev"
          ];
          cwd = "frontend";
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
        
        # Backend API preview
        backend = {
          command = [
            "npm"
            "run"
            "dev"
          ];
          cwd = "backend";
          manager = "web";
          env = {
            PORT = "3001";
          };
        };
      };
    };
  };
}