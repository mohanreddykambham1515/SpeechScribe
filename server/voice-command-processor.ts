interface CommandResult {
  success: boolean;
  message: string;
  action?: string;
  url?: string;
  steps?: CommandStep[];
  information?: string;
  sources?: string[];
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
    
    // Check for information requests first
    const informationResult = this.processInformationRequest(normalizedCommand);
    if (informationResult.success) {
      return informationResult;
    }
    
    // Check for complex actions
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

  private processInformationRequest(command: string): CommandResult {
    // Check for question patterns
    const questionPatterns = [
      /^(what|who|where|when|why|how|which|tell me about|explain|describe|define)/i,
      /^(is|are|was|were|do|does|did|can|could|would|should|will)/i,
      /(about|information|details|facts|history|meaning|definition)/i,
      /\?$/
    ];
    
    const isQuestion = questionPatterns.some(pattern => pattern.test(command));
    
    if (isQuestion) {
      return {
        success: true,
        message: "I'll search for information about that topic",
        action: 'information_request',
        information: this.generateInformationResponse(command)
      };
    }
    
    return { success: false, message: "" };
  }

  private generateInformationResponse(command: string): string {
    const topic = this.extractTopicFromCommand(command);
    
    // Generate contextual responses based on topic
    const response = this.getContextualResponse(topic, command);
    
    return `${response}

🌐 **Need more specific information?**
I can help you search for current details about "${topic}":

• Search Google for latest information
• Find Wikipedia articles and educational resources
• Look up news and recent developments
• Access official websites and documentation

💡 **Quick Actions**: 
- Say "search Google for ${topic}" for current information
- Ask "find ${topic} on Wikipedia" for detailed explanations
- Request "${topic} news" for recent developments

Would you like me to search for more specific information about "${topic}"?`;
  }

  private getContextualResponse(topic: string, originalCommand: string): string {
    const topicLower = topic.toLowerCase();
    
    // Technology topics
    if (topicLower.includes('artificial intelligence') || topicLower.includes('ai')) {
      return `🤖 **About Artificial Intelligence**:

Artificial Intelligence (AI) is a technology that enables machines to perform tasks that typically require human intelligence, such as learning, reasoning, and problem-solving.

**Key Areas**:
• Machine Learning - algorithms that improve through experience
• Natural Language Processing - understanding human language
• Computer Vision - interpreting visual information
• Robotics - physical AI applications

**Current Applications**:
• Voice assistants (like this one!)
• Recommendation systems
• Autonomous vehicles
• Medical diagnosis
• Financial analysis`;
    }
    
    // Geography topics
    if (topicLower.includes('india')) {
      return `🇮🇳 **About India**:

India is the world's largest democracy and second-most populous country, located in South Asia.

**Key Facts**:
• Capital: New Delhi
• Population: Over 1.4 billion people
• Languages: Hindi, English, and 22 official regional languages
• Currency: Indian Rupee (INR)
• Government: Federal parliamentary republic

**Notable Features**:
• Rich cultural heritage spanning thousands of years
• Major technology and software development hub
• Diverse landscapes from Himalayas to tropical beaches
• Home to major religions: Hinduism, Islam, Christianity, Sikhism`;
    }
    
    // Technology concepts
    if (topicLower.includes('machine learning')) {
      return `🧠 **About Machine Learning**:

Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.

**How it Works**:
• Algorithms analyze patterns in data
• Models are trained on examples
• System makes predictions on new data
• Performance improves with more data

**Types**:
• Supervised Learning - learns from labeled examples
• Unsupervised Learning - finds patterns in unlabeled data
• Reinforcement Learning - learns through trial and error

**Applications**:
• Image recognition, speech processing, recommendations, fraud detection`;
    }
    
    // Science topics
    if (topicLower.includes('climate change') || topicLower.includes('global warming')) {
      return `🌍 **About Climate Change**:

Climate change refers to long-term shifts in global temperatures and weather patterns due to human activities.

**Key Causes**:
• Greenhouse gas emissions from fossil fuels
• Deforestation and land use changes
• Industrial processes and agriculture
• Transportation and energy production

**Current Effects**:
• Rising global temperatures
• Melting ice caps and glaciers
• Sea level rise
• Extreme weather events
• Ecosystem disruption`;
    }
    
    // Space and astronomy
    if (topicLower.includes('space') || topicLower.includes('universe') || topicLower.includes('solar system')) {
      return `🚀 **About Space & Universe**:

Space exploration and astronomy help us understand our place in the universe.

**Solar System**:
• Sun and 8 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)
• Asteroid belt between Mars and Jupiter
• Kuiper Belt beyond Neptune
• Oort Cloud at the edge of our solar system

**Recent Discoveries**:
• Exoplanets (planets outside our solar system)
• Black holes and gravitational waves
• Dark matter and dark energy
• Evidence of water on Mars and moons of Jupiter/Saturn`;
    }
    
    // History topics
    if (topicLower.includes('world war') || topicLower.includes('history')) {
      return `📚 **About History**:

Understanding history helps us learn from past events and their impact on the present.

**Major Historical Periods**:
• Ancient civilizations (Egypt, Greece, Rome, China, India)
• Medieval period (Middle Ages)
• Renaissance and Enlightenment
• Industrial Revolution
• Modern era (20th-21st centuries)

**Key Themes**:
• Rise and fall of empires
• Technological advancement
• Social and political movements
• Cultural exchange and trade
• Wars and conflicts`;
    }
    
    // Health and medicine
    if (topicLower.includes('health') || topicLower.includes('medicine') || topicLower.includes('covid')) {
      return `🏥 **About Health & Medicine**:

Modern medicine and healthcare focus on preventing, diagnosing, and treating diseases.

**Medical Fields**:
• Cardiology (heart), Neurology (brain), Oncology (cancer)
• Pediatrics (children), Geriatrics (elderly)
• Psychiatry (mental health), Surgery
• Preventive medicine and public health

**Recent Advances**:
• Gene therapy and personalized medicine
• Telemedicine and digital health
• Immunotherapy and targeted treatments
• Vaccine development and disease prevention`;
    }
    
    // General response for any topic
    return `📋 **About "${topic}"**:

I understand you're asking about ${topic}. This is an interesting topic that covers various aspects and applications.

**What I can help with**:
• Provide general information and context
• Direct you to authoritative sources
• Help you search for specific details
• Find current news and developments

**For comprehensive information**, I recommend accessing current sources since topics evolve rapidly with new developments and research.`;
  }

  private extractTopicFromCommand(command: string): string {
    // Remove common question words and extract the main topic
    let cleaned = command
      .replace(/^(what|who|where|when|why|how|which|tell me about|explain|describe|define)\s+/i, '')
      .replace(/^(is|are|was|were|do|does|did|can|could|would|should|will)\s+/i, '')
      .replace(/\s+(about|information|details|facts|history|meaning|definition)\s*/i, ' ')
      .replace(/\?$/, '')
      .trim();
    
    // Handle "what is X" pattern specifically
    if (command.toLowerCase().startsWith('what is')) {
      cleaned = command.replace(/^what is\s+/i, '').replace(/\?$/, '').trim();
    }
    
    // Handle "tell me about X" pattern
    if (command.toLowerCase().includes('tell me about')) {
      cleaned = command.replace(/.*tell me about\s+/i, '').replace(/\?$/, '').trim();
    }
    
    return cleaned || 'this topic';
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