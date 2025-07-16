interface CommandResult {
  success: boolean;
  message: string;
  action?: string;
  url?: string;
  steps?: CommandStep[];
  information?: string;
  sources?: string[];
  isMultiTask?: boolean;
  tasks?: TaskResult[];
}

interface TaskResult {
  taskNumber: number;
  command: string;
  result: CommandResult;
  status: 'completed' | 'failed' | 'pending';
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
      
      // Shopping & E-commerce
      'sportsdirect': 'https://www.sportsdirect.com',
      'sports direct': 'https://www.sportsdirect.com',
      'nike': 'https://www.nike.com',
      'adidas': 'https://www.adidas.com',
      'puma': 'https://www.puma.com',
      'under armour': 'https://www.underarmour.com',
      'zara': 'https://www.zara.com',
      'h&m': 'https://www.hm.com',
      'uniqlo': 'https://www.uniqlo.com',
      'forever21': 'https://www.forever21.com',
      'target': 'https://www.target.com',
      'walmart': 'https://www.walmart.com',
      'costco': 'https://www.costco.com',
      'bestbuy': 'https://www.bestbuy.com',
      'best buy': 'https://www.bestbuy.com',
      
      // News & Media
      'bbc': 'https://www.bbc.com',
      'cnn': 'https://www.cnn.com',
      'reuters': 'https://www.reuters.com',
      'guardian': 'https://www.theguardian.com',
      'nytimes': 'https://www.nytimes.com',
      'new york times': 'https://www.nytimes.com',
      'wsj': 'https://www.wsj.com',
      'wall street journal': 'https://www.wsj.com',
      'forbes': 'https://www.forbes.com',
      'techcrunch': 'https://techcrunch.com',
      
      // Entertainment
      'imdb': 'https://www.imdb.com',
      'hulu': 'https://www.hulu.com',
      'disney': 'https://www.disney.com',
      'disneyplus': 'https://www.disneyplus.com',
      'disney+': 'https://www.disneyplus.com',
      'hbo': 'https://www.hbo.com',
      'prime video': 'https://www.primevideo.com',
      'paramount': 'https://www.paramountplus.com',
      'peacock': 'https://www.peacocktv.com',
      
      // Social & Communication
      'tiktok': 'https://www.tiktok.com',
      'snapchat': 'https://www.snapchat.com',
      'telegram': 'https://web.telegram.org',
      'signal': 'https://signal.org',
      'skype': 'https://www.skype.com',
      'teams': 'https://teams.microsoft.com',
      'meet': 'https://meet.google.com',
      'google meet': 'https://meet.google.com',
      
      // Travel & Maps
      'booking': 'https://www.booking.com',
      'airbnb': 'https://www.airbnb.com',
      'expedia': 'https://www.expedia.com',
      'maps': 'https://maps.google.com',
      'google maps': 'https://maps.google.com',
      'uber': 'https://www.uber.com',
      'lyft': 'https://www.lyft.com',
      'tripadvisor': 'https://www.tripadvisor.com',
      
      // Finance & Banking
      'payoneer': 'https://www.payoneer.com',
      'wise': 'https://wise.com',
      'revolut': 'https://www.revolut.com',
      'coinbase': 'https://www.coinbase.com',
      'binance': 'https://www.binance.com',
      'kraken': 'https://www.kraken.com',
      'robinhood': 'https://robinhood.com',
      'etoro': 'https://www.etoro.com',
      
      // Food & Delivery
      'ubereats': 'https://www.ubereats.com',
      'uber eats': 'https://www.ubereats.com',
      'doordash': 'https://www.doordash.com',
      'grubhub': 'https://www.grubhub.com',
      'deliveroo': 'https://deliveroo.com',
      'just eat': 'https://www.just-eat.com',
      'zomato': 'https://www.zomato.com',
      'swiggy': 'https://www.swiggy.com',
      
      // Education & Learning
      'coursera': 'https://www.coursera.org',
      'udemy': 'https://www.udemy.com',
      'edx': 'https://www.edx.org',
      'khan academy': 'https://www.khanacademy.org',
      'duolingo': 'https://www.duolingo.com',
      'codecademy': 'https://www.codecademy.com',
      'freecodecamp': 'https://www.freecodecamp.org',
      'leetcode': 'https://leetcode.com',
      'hackerrank': 'https://www.hackerrank.com',
      
      // Productivity & Tools
      'notion': 'https://www.notion.so',
      'trello': 'https://trello.com',
      'asana': 'https://asana.com',
      'monday': 'https://monday.com',
      'airtable': 'https://airtable.com',
      'figma': 'https://www.figma.com',
      'canva': 'https://www.canva.com',
      'adobe': 'https://www.adobe.com',
      'photoshop': 'https://www.adobe.com/products/photoshop.html',
      
      // Health & Fitness
      'fitbit': 'https://www.fitbit.com',
      'myfitnesspal': 'https://www.myfitnesspal.com',
      'strava': 'https://www.strava.com',
      'peloton': 'https://www.onepeloton.com',
      'nike training': 'https://www.nike.com/ntc-app',
      'headspace': 'https://www.headspace.com',
      'calm': 'https://www.calm.com',
      
      // Gaming
      'steam': 'https://store.steampowered.com',
      'epic games': 'https://www.epicgames.com',
      'origin': 'https://www.origin.com',
      'battlenet': 'https://www.battle.net',
      'playstation': 'https://www.playstation.com',
      'xbox': 'https://www.xbox.com',
      'nintendo': 'https://www.nintendo.com',
      'roblox': 'https://www.roblox.com',
      'minecraft': 'https://www.minecraft.net',
    };
  }

  processCommand(command: string): CommandResult {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Check for multitask commands (numbered lists) - use original command for parsing
    if (this.isMultiTaskCommand(command)) {
      return this.processMultiTaskCommand(command);
    }
    
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

  private isMultiTaskCommand(command: string): boolean {
    // Check for numbered list patterns - look for multiple numbered items
    const numberedItems = command.match(/\d+\.\s*[^0-9]+/g);
    return numberedItems && numberedItems.length > 1;
  }

  private processMultiTaskCommand(command: string): CommandResult {
    // Parse the numbered list
    const tasks = this.parseNumberedList(command);

    
    if (tasks.length === 0) {
      return {
        success: false,
        message: 'No valid tasks found in the command',
        action: 'multitask',
        isMultiTask: true,
        tasks: []
      };
    }
    
    const taskResults: TaskResult[] = [];
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const result = this.processSingleTask(task.command);
      
      taskResults.push({
        taskNumber: task.number,
        command: task.command,
        result: result,
        status: result.success ? 'completed' : 'failed'
      });
    }
    
    const completedTasks = taskResults.filter(t => t.status === 'completed').length;
    const totalTasks = taskResults.length;
    
    return {
      success: true,
      message: `Multitask execution completed: ${completedTasks}/${totalTasks} tasks successful`,
      action: 'multitask',
      isMultiTask: true,
      tasks: taskResults
    };
  }

  private parseNumberedList(command: string): { number: number, command: string }[] {
    const tasks: { number: number, command: string }[] = [];
    
    // Split by numbered pattern and process each match
    const numberedItems = command.match(/(\d+)\.\s*([^0-9]+?)(?=\s*\d+\.|$)/g);
    
    if (numberedItems) {
      for (const item of numberedItems) {
        const match = item.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          tasks.push({
            number: parseInt(match[1]),
            command: match[2].trim()
          });
        }
      }
    }
    
    return tasks;
  }

  private processSingleTask(command: string): CommandResult {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Check for information requests
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
      /\?$/,
      // More conversational patterns
      /^(i want to know|i need to know|i'm curious about|show me|find out about)/i,
      /\b(search for|look up|find information about|research)\b/i,
      /^(tell me|show me|give me|find me|get me)/i
    ];
    
    const isQuestion = questionPatterns.some(pattern => pattern.test(command));
    
    // Also check for standalone topics that might be implicit questions
    const standaloneTopics = [
      'artificial intelligence', 'machine learning', 'climate change', 'global warming',
      'space', 'universe', 'solar system', 'history', 'medicine', 'health', 'science',
      'technology', 'programming', 'coding', 'javascript', 'python', 'react', 'nodejs',
      'covid', 'coronavirus', 'vaccine', 'pandemic', 'economy', 'stock market',
      'cryptocurrency', 'bitcoin', 'blockchain', 'web3', 'nft', 'metaverse',
      'politics', 'government', 'democracy', 'election', 'president', 'congress',
      'education', 'university', 'college', 'school', 'learning', 'study',
      'food', 'cooking', 'recipe', 'nutrition', 'diet', 'fitness', 'exercise',
      'travel', 'vacation', 'tourism', 'hotel', 'flight', 'car', 'transportation',
      'movie', 'film', 'music', 'song', 'book', 'novel', 'game', 'sport',
      'weather', 'climate', 'temperature', 'rain', 'snow', 'storm', 'hurricane',
      'business', 'company', 'startup', 'entrepreneur', 'marketing', 'sales',
      'job', 'career', 'work', 'employment', 'salary', 'interview', 'resume'
    ];
    
    const isStandaloneTopic = standaloneTopics.some(topic => 
      command.toLowerCase().includes(topic.toLowerCase())
    );
    
    if (isQuestion || isStandaloneTopic) {
      return {
        success: true,
        message: "I'll provide information about that topic",
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
    
    // Programming languages
    if (topicLower.includes('javascript')) {
      return `💻 **About JavaScript**:

JavaScript is a versatile programming language primarily used for web development.

**Key Features**:
• Dynamic typing and interpreted execution
• Runs in browsers and on servers (Node.js)
• Event-driven and asynchronous programming
• Supports object-oriented and functional programming

**Common Uses**:
• Frontend web development (React, Vue, Angular)
• Backend development (Node.js, Express)
• Mobile app development (React Native)
• Desktop applications (Electron)
• Game development and data visualization`;
    }
    
    if (topicLower.includes('python')) {
      return `🐍 **About Python**:

Python is a high-level programming language known for its simplicity and readability.

**Key Features**:
• Easy-to-read syntax
• Extensive standard library
• Cross-platform compatibility
• Strong community support

**Popular Uses**:
• Web development (Django, Flask)
• Data science and machine learning
• Automation and scripting
• Scientific computing
• Artificial intelligence development`;
    }
    
    // Cryptocurrency and blockchain
    if (topicLower.includes('bitcoin') || topicLower.includes('cryptocurrency')) {
      return `₿ **About Cryptocurrency & Bitcoin**:

Cryptocurrency is digital money secured by cryptography and operated on decentralized networks.

**Bitcoin Basics**:
• First cryptocurrency created in 2009
• Decentralized digital currency
• Uses blockchain technology
• Limited supply of 21 million coins

**Key Concepts**:
• Blockchain: Distributed ledger technology
• Mining: Process of validating transactions
• Wallets: Software to store and manage crypto
• Volatility: Prices can fluctuate significantly`;
    }
    
    // Web development
    if (topicLower.includes('programming') || topicLower.includes('coding')) {
      return `🖥️ **About Programming**:

Programming is the process of creating instructions for computers to solve problems and automate tasks.

**Popular Languages**:
• JavaScript - Web development
• Python - Data science, AI, web development
• Java - Enterprise applications
• C++ - System programming, games
• Swift - iOS development

**Key Concepts**:
• Variables and data types
• Control structures (loops, conditions)
• Functions and algorithms
• Object-oriented programming
• Problem-solving and logical thinking`;
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
    const normalizedName = websiteName.toLowerCase().trim();
    
    // Remove common suffixes and words
    const cleanName = normalizedName
      .replace(/\.com$/, '')
      .replace(/\.org$/, '')
      .replace(/\.net$/, '')
      .replace(/\.io$/, '')
      .replace(/website$/, '')
      .replace(/site$/, '')
      .replace(/\bthe\b/g, '')
      .replace(/\bopen\b/g, '')
      .replace(/\bgo\b/g, '')
      .replace(/\bto\b/g, '')
      .trim();

    // Direct match
    if (this.websiteMap[cleanName]) {
      return {
        success: true,
        message: `Opening ${cleanName}`,
        action: 'open_website',
        url: this.websiteMap[cleanName]
      };
    }

    // Special aliases and common variations
    const aliases: { [key: string]: string } = {
      'fb': 'facebook',
      'ig': 'instagram', 
      'yt': 'youtube',
      'gm': 'gmail',
      'sports': 'sports direct',
      'sport': 'sports direct',
      'direct': 'sports direct',
      'sportsdirect': 'sports direct',
      'linked': 'linkedin',
      'whats': 'whatsapp',
      'app': 'whatsapp',
      'stack': 'stackoverflow',
      'overflow': 'stackoverflow',
      'prime': 'prime video',
      'video': 'prime video',
      'best': 'best buy',
      'buy': 'best buy',
      'bestbuy': 'best buy',
      'epic': 'epic games',
      'games': 'epic games',
      'khan': 'khan academy',
      'academy': 'khan academy',
      'free': 'freecodecamp',
      'code': 'freecodecamp',
      'camp': 'freecodecamp',
      'leet': 'leetcode',
      'hacker': 'hackerrank',
      'rank': 'hackerrank',
      'my': 'myfitnesspal',
      'fitness': 'myfitnesspal',
      'pal': 'myfitnesspal',
      'disney': 'disney+',
      'plus': 'disney+',
      'times': 'new york times',
      'york': 'new york times',
      'new': 'new york times',
      'wall': 'wall street journal',
      'street': 'wall street journal',
      'journal': 'wall street journal',
      'wsj': 'wall street journal',
      'tech': 'techcrunch',
      'crunch': 'techcrunch',
      'uber': 'uber',
      'eats': 'uber eats',
      'door': 'doordash',
      'dash': 'doordash',
      'grub': 'grubhub',
      'hub': 'grubhub',
      'just': 'just eat',
      'eat': 'just eat',
      'h': 'h&m',
      'm': 'h&m',
      'under': 'under armour',
      'armour': 'under armour',
      'armor': 'under armour',
      'forever': 'forever21',
      '21': 'forever21',
      'twenty': 'forever21',
      'one': 'forever21'
    };

    // Check aliases
    for (const [alias, fullName] of Object.entries(aliases)) {
      if (cleanName.includes(alias) || alias.includes(cleanName)) {
        const url = this.websiteMap[fullName];
        if (url) {
          return {
            success: true,
            message: `Opening ${fullName}`,
            action: 'open_website',
            url: url
          };
        }
      }
    }

    // Fuzzy matching - check if the input contains any known website names
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

    // Check for partial word matches
    const words = cleanName.split(' ');
    for (const word of words) {
      if (word.length > 2) { // Only check meaningful words
        for (const [key, url] of Object.entries(this.websiteMap)) {
          if (key.includes(word) || word.includes(key)) {
            return {
              success: true,
              message: `Opening ${key}`,
              action: 'open_website',
              url: url
            };
          }
        }
      }
    }

    // If no match found, try to construct a URL
    if (cleanName.length > 0) {
      const constructedUrl = `https://www.${cleanName.replace(/\s+/g, '')}.com`;
      return {
        success: true,
        message: `Opening ${cleanName}`,
        action: 'open_website',
        url: constructedUrl
      };
    }

    return { 
      success: false, 
      message: `I couldn't find a website for "${websiteName}". Try being more specific or say "open [website name]".` 
    };
  }

  getSupportedWebsites(): string[] {
    return Object.keys(this.websiteMap);
  }

  addWebsite(name: string, url: string): void {
    this.websiteMap[name.toLowerCase()] = url;
  }
}

export const voiceCommandProcessor = new VoiceCommandProcessor();