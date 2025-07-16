interface CommandResult {
  success: boolean;
  message: string;
  action?: string;
  url?: string;
  steps?: CommandStep[];
}

interface CommandStep {
  type: 'navigate' | 'search' | 'click' | 'wait' | 'type';
  target?: string;
  value?: string;
  selector?: string;
  description: string;
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
    
    // Check for complex actions first
    const complexActionResult = this.processComplexAction(normalizedCommand);
    if (complexActionResult.success) {
      return complexActionResult;
    }
    
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

  private processComplexAction(command: string): CommandResult {
    // YouTube music commands
    if (command.includes('youtube') && (command.includes('play') || command.includes('search'))) {
      return this.processYouTubeMusic(command);
    }
    
    // Spotify music commands
    if (command.includes('spotify') && (command.includes('play') || command.includes('search'))) {
      return this.processSpotifyMusic(command);
    }
    
    // Google search commands
    if (command.includes('google') && (command.includes('search') || command.includes('for'))) {
      return this.processGoogleSearch(command);
    }
    
    // Amazon shopping commands
    if (command.includes('amazon') && (command.includes('search') || command.includes('buy') || command.includes('find'))) {
      return this.processAmazonShopping(command);
    }
    
    // Gmail commands
    if (command.includes('gmail') && (command.includes('send') || command.includes('compose') || command.includes('email'))) {
      return this.processGmailAction(command);
    }
    
    return { success: false, message: "" };
  }
  
  private processYouTubeMusic(command: string): CommandResult {
    // Extract search terms for music
    let searchQuery = '';
    
    // Pattern: "open youtube and play [song/music]"
    const playMatch = command.match(/(?:open\s+youtube\s+and\s+play|play\s+on\s+youtube|youtube\s+play)\s+(.+)/);
    if (playMatch) {
      searchQuery = playMatch[1].trim();
    }
    
    // Pattern: "search youtube for [query]"
    const searchMatch = command.match(/(?:search\s+youtube\s+for|youtube\s+search)\s+(.+)/);
    if (searchMatch) {
      searchQuery = searchMatch[1].trim();
    }
    
    if (searchQuery) {
      const steps: CommandStep[] = [
        {
          type: 'navigate',
          target: 'https://www.youtube.com',
          description: 'Opening YouTube'
        },
        {
          type: 'wait',
          value: '2000',
          description: 'Waiting for page to load'
        },
        {
          type: 'search',
          target: 'input[name="search_query"]',
          value: searchQuery,
          description: `Searching for "${searchQuery}"`
        },
        {
          type: 'click',
          target: 'button[id="search-icon-legacy"]',
          description: 'Clicking search button'
        },
        {
          type: 'wait',
          value: '3000',
          description: 'Waiting for search results'
        },
        {
          type: 'click',
          target: 'a[id="video-title"]',
          description: 'Playing first video result'
        }
      ];
      
      return {
        success: true,
        message: `Opening YouTube and playing "${searchQuery}"`,
        action: 'complex_action',
        url: 'https://www.youtube.com',
        steps: steps
      };
    }
    
    return { success: false, message: "Please specify what to play on YouTube" };
  }
  
  private processSpotifyMusic(command: string): CommandResult {
    let searchQuery = '';
    
    const playMatch = command.match(/(?:open\s+spotify\s+and\s+play|play\s+on\s+spotify|spotify\s+play)\s+(.+)/);
    if (playMatch) {
      searchQuery = playMatch[1].trim();
    }
    
    if (searchQuery) {
      const steps: CommandStep[] = [
        {
          type: 'navigate',
          target: 'https://open.spotify.com',
          description: 'Opening Spotify Web Player'
        },
        {
          type: 'wait',
          value: '3000',
          description: 'Waiting for page to load'
        },
        {
          type: 'search',
          target: 'input[data-testid="search-input"]',
          value: searchQuery,
          description: `Searching for "${searchQuery}"`
        },
        {
          type: 'wait',
          value: '2000',
          description: 'Waiting for search results'
        },
        {
          type: 'click',
          target: 'button[data-testid="play-button"]',
          description: 'Playing first result'
        }
      ];
      
      return {
        success: true,
        message: `Opening Spotify and playing "${searchQuery}"`,
        action: 'complex_action',
        url: 'https://open.spotify.com',
        steps: steps
      };
    }
    
    return { success: false, message: "Please specify what to play on Spotify" };
  }
  
  private processGoogleSearch(command: string): CommandResult {
    let searchQuery = '';
    
    const searchMatch = command.match(/(?:google\s+search\s+for|search\s+google\s+for|google\s+for)\s+(.+)/);
    if (searchMatch) {
      searchQuery = searchMatch[1].trim();
    }
    
    if (searchQuery) {
      const steps: CommandStep[] = [
        {
          type: 'navigate',
          target: 'https://www.google.com',
          description: 'Opening Google'
        },
        {
          type: 'wait',
          value: '2000',
          description: 'Waiting for page to load'
        },
        {
          type: 'search',
          target: 'input[name="q"]',
          value: searchQuery,
          description: `Searching for "${searchQuery}"`
        },
        {
          type: 'click',
          target: 'input[name="btnK"]',
          description: 'Clicking search button'
        }
      ];
      
      return {
        success: true,
        message: `Searching Google for "${searchQuery}"`,
        action: 'complex_action',
        url: 'https://www.google.com',
        steps: steps
      };
    }
    
    return { success: false, message: "Please specify what to search for on Google" };
  }
  
  private processAmazonShopping(command: string): CommandResult {
    let searchQuery = '';
    
    const searchMatch = command.match(/(?:amazon\s+search\s+for|search\s+amazon\s+for|find\s+on\s+amazon|buy\s+on\s+amazon)\s+(.+)/);
    if (searchMatch) {
      searchQuery = searchMatch[1].trim();
    }
    
    if (searchQuery) {
      const steps: CommandStep[] = [
        {
          type: 'navigate',
          target: 'https://www.amazon.com',
          description: 'Opening Amazon'
        },
        {
          type: 'wait',
          value: '2000',
          description: 'Waiting for page to load'
        },
        {
          type: 'search',
          target: 'input[id="twotabsearchtextbox"]',
          value: searchQuery,
          description: `Searching for "${searchQuery}"`
        },
        {
          type: 'click',
          target: 'input[id="nav-search-submit-button"]',
          description: 'Clicking search button'
        }
      ];
      
      return {
        success: true,
        message: `Searching Amazon for "${searchQuery}"`,
        action: 'complex_action',
        url: 'https://www.amazon.com',
        steps: steps
      };
    }
    
    return { success: false, message: "Please specify what to search for on Amazon" };
  }
  
  private processGmailAction(command: string): CommandResult {
    if (command.includes('compose') || command.includes('send') || command.includes('email')) {
      const steps: CommandStep[] = [
        {
          type: 'navigate',
          target: 'https://mail.google.com',
          description: 'Opening Gmail'
        },
        {
          type: 'wait',
          value: '3000',
          description: 'Waiting for Gmail to load'
        },
        {
          type: 'click',
          target: 'div[role="button"][gh="cm"]',
          description: 'Clicking compose button'
        }
      ];
      
      return {
        success: true,
        message: 'Opening Gmail and starting to compose an email',
        action: 'complex_action',
        url: 'https://mail.google.com',
        steps: steps
      };
    }
    
    return { success: false, message: "Please specify what to do in Gmail" };
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