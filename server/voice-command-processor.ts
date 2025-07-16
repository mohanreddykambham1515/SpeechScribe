interface CommandResult {
  success: boolean;
  message: string;
  action?: string;
  url?: string;
}

interface WebsiteMapping {
  [key: string]: string;
}

export class VoiceCommandProcessor {
  private websiteMap: WebsiteMapping;

  constructor() {
    this.websiteMap = {
      'google': 'https://www.google.com',
      'youtube': 'https://www.youtube.com',
      'facebook': 'https://www.facebook.com',
      'amazon': 'https://www.amazon.com',
      'twitter': 'https://www.twitter.com',
      'instagram': 'https://www.instagram.com',
      'linkedin': 'https://www.linkedin.com',
      'reddit': 'https://www.reddit.com',
      'wikipedia': 'https://www.wikipedia.org',
      'github': 'https://www.github.com',
      'stackoverflow': 'https://www.stackoverflow.com',
      'netflix': 'https://www.netflix.com',
      'spotify': 'https://www.spotify.com',
      'whatsapp': 'https://web.whatsapp.com',
      'gmail': 'https://mail.google.com',
      'outlook': 'https://outlook.live.com',
      'yahoo': 'https://www.yahoo.com',
      'bing': 'https://www.bing.com',
      'pinterest': 'https://www.pinterest.com',
      'tumblr': 'https://www.tumblr.com',
      'discord': 'https://discord.com',
      'slack': 'https://slack.com',
      'zoom': 'https://zoom.us',
      'microsoft': 'https://www.microsoft.com',
      'apple': 'https://www.apple.com',
      'dropbox': 'https://www.dropbox.com',
      'drive': 'https://drive.google.com',
      'onedrive': 'https://onedrive.live.com',
      'twitch': 'https://www.twitch.tv',
      'ebay': 'https://www.ebay.com',
      'aliexpress': 'https://www.aliexpress.com',
      'shopify': 'https://www.shopify.com',
      'etsy': 'https://www.etsy.com',
      'paypal': 'https://www.paypal.com',
      'stripe': 'https://www.stripe.com',
      'medium': 'https://medium.com',
      'dev': 'https://dev.to',
      'codepen': 'https://codepen.io',
      'replit': 'https://replit.com',
      'vercel': 'https://vercel.com',
      'netlify': 'https://netlify.com',
      'heroku': 'https://heroku.com',
      'aws': 'https://aws.amazon.com',
      'azure': 'https://azure.microsoft.com',
      'gcp': 'https://cloud.google.com',
      'docker': 'https://www.docker.com',
      'kubernetes': 'https://kubernetes.io',
    };
  }

  processCommand(command: string): CommandResult {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Check for "open" commands
    if (normalizedCommand.includes('open')) {
      return this.processOpenCommand(normalizedCommand);
    }
    
    // Check for "go to" commands
    if (normalizedCommand.includes('go to')) {
      return this.processGoToCommand(normalizedCommand);
    }
    
    // Check for "navigate to" commands
    if (normalizedCommand.includes('navigate to')) {
      return this.processNavigateCommand(normalizedCommand);
    }
    
    // Check for "visit" commands
    if (normalizedCommand.includes('visit')) {
      return this.processVisitCommand(normalizedCommand);
    }
    
    // Check for direct website mention
    return this.processDirectWebsiteCommand(normalizedCommand);
  }

  private processOpenCommand(command: string): CommandResult {
    const match = command.match(/open\s+(.+)/);
    if (match) {
      const website = match[1].trim();
      return this.findWebsite(website);
    }
    return { success: false, message: "Please specify which website to open" };
  }

  private processGoToCommand(command: string): CommandResult {
    const match = command.match(/go\s+to\s+(.+)/);
    if (match) {
      const website = match[1].trim();
      return this.findWebsite(website);
    }
    return { success: false, message: "Please specify which website to go to" };
  }

  private processNavigateCommand(command: string): CommandResult {
    const match = command.match(/navigate\s+to\s+(.+)/);
    if (match) {
      const website = match[1].trim();
      return this.findWebsite(website);
    }
    return { success: false, message: "Please specify which website to navigate to" };
  }

  private processVisitCommand(command: string): CommandResult {
    const match = command.match(/visit\s+(.+)/);
    if (match) {
      const website = match[1].trim();
      return this.findWebsite(website);
    }
    return { success: false, message: "Please specify which website to visit" };
  }

  private processDirectWebsiteCommand(command: string): CommandResult {
    // Check if command directly mentions a website
    for (const [key, url] of Object.entries(this.websiteMap)) {
      if (command.includes(key)) {
        return {
          success: true,
          message: `Opening ${key}`,
          action: 'open_website',
          url: url
        };
      }
    }
    return { success: false, message: "I couldn't understand that command. Try saying 'open [website]' or 'go to [website]'" };
  }

  private findWebsite(websiteName: string): CommandResult {
    // Remove common suffixes
    const cleanName = websiteName
      .replace(/\.com$/, '')
      .replace(/\.org$/, '')
      .replace(/\.net$/, '')
      .replace(/\.io$/, '')
      .replace(/website$/, '')
      .replace(/site$/, '')
      .trim();

    // Check exact match
    if (this.websiteMap[cleanName]) {
      return {
        success: true,
        message: `Opening ${cleanName}`,
        action: 'open_website',
        url: this.websiteMap[cleanName]
      };
    }

    // Check partial match
    for (const [key, url] of Object.entries(this.websiteMap)) {
      if (key.includes(cleanName) || cleanName.includes(key)) {
        return {
          success: true,
          message: `Opening ${key}`,
          action: 'open_website',
          url: url
        };
      }
    }

    // If no match found, try to construct a URL
    if (cleanName.length > 0) {
      const constructedUrl = `https://www.${cleanName}.com`;
      return {
        success: true,
        message: `Opening ${cleanName}`,
        action: 'open_website',
        url: constructedUrl
      };
    }

    return { success: false, message: `I couldn't find a website for "${websiteName}". Try being more specific.` };
  }

  getSupportedWebsites(): string[] {
    return Object.keys(this.websiteMap);
  }

  addWebsite(name: string, url: string): void {
    this.websiteMap[name.toLowerCase()] = url;
  }
}

export const voiceCommandProcessor = new VoiceCommandProcessor();