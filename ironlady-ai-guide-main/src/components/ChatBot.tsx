import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Send, Bot, User, Sparkles, Phone, Mail, Globe, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import ironLadyLogo from '@/assets/iron-lady-logo.gif';
import ironLadyLogoWhite from '@/assets/iron-lady-logo-white.png';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const IRON_LADY_FAQ = {
  programs: {
    "What programs does Iron Lady offer?": `Iron Lady offers three flagship programs:

🎯 **Leadership Essentials Program** - Learn to be unapologetically ambitious, master shameless pitching, and deal with office politics and biases.

🏆 **100 Board Members Program** - Innovative techniques to fast-track your overdue growth and break through career plateaus.

⚔️ **Master of Business Warfare** - Cutting-edge business warfare tactics for C-suite breakthroughs and achieving 1+ Crore income.

All programs focus on helping women overcome stereotypes, biases, and politics in the business world using proven "Business War Tactics".`,

    "What is the program duration?": `Program durations vary by course:

📅 **Leadership Essentials Program**: Comprehensive multi-week program with live sessions and ongoing support
📅 **100 Board Members Program**: Intensive fast-track program designed for rapid career advancement  
📅 **Master of Business Warfare**: Extended premium program for executive-level transformation
📅 **Leadership Masterclass**: 3-day intensive workshops

All programs include lifetime access to resources and community support. Exact durations are shared during consultation calls.`,

    "Are the programs online or offline?": `Iron Lady offers **both online and offline formats**:

💻 **Online Programs**: Live interactive sessions, recorded content, digital resources, and virtual networking
🏢 **Offline Programs**: In-person workshops, networking events, and intensive bootcamps
🔄 **Hybrid Options**: Combination of online learning with offline networking events

Our online programs are highly effective and interactive - many participants are surprised by the impact of the digital format!`,

    "Are certificates provided?": `Yes! **Iron Lady provides certificates** for all completed programs:

🏅 **Program Completion Certificates** for all three flagship programs
🏅 **Leadership Masterclass Certificates** for workshop attendance  
🏅 **Community Recognition** within our 78,000+ women leaders ecosystem
🏅 **LinkedIn-worthy credentials** to showcase your leadership development

Certificates are issued upon successful completion of program requirements and assessments.`,

    "Who are the mentors and coaches?": `Iron Lady features **world-class mentors and coaches**:

👑 **Rajesh & Team** - Founders and lead coaches with proven track records
👑 **Global Practitioners** - CEOs and entrepreneurs who've applied these strategies
👑 **Industry Experts** - Business leaders who share personal learnings and experiences
👑 **Peer Mentors** - Successful program alumni who guide new participants

Our content is created and practiced by global practitioners, entrepreneurs, and CEOs who include their personal experiences and winning methodologies.`
  },
  
  contact: {
    "How can I contact Iron Lady?": `📞 **Contact Iron Lady**:

🌐 **Website**: https://iamironlady.com
📧 **Email**: Contact through website form
📱 **LinkedIn**: https://in.linkedin.com/company/iron-lady-1
💬 **Live Chat**: Available on website for instant support
📅 **Consultation**: Free counselor sessions available

**Office Location**: Bangalore, Karnataka, India
**Community**: 78,000+ women leaders ecosystem

For program-specific queries, speak to our counselors who can guide you on the best program for your goals.`,

    "What are Iron Lady's social media channels?": `🔗 **Follow Iron Lady**:

🌐 **Website**: https://iamironlady.com
📱 **LinkedIn**: https://in.linkedin.com/company/iron-lady-1 (18,386+ followers)
📘 **Facebook**: https://www.facebook.com/IamIronLady/
▶️ **YouTube**: Search "Iron Lady Leadership" for masterclass videos and success stories
📸 **Events Gallery**: Regular updates on workshops and achievements

Stay connected for:
✨ Leadership tips and strategies
✨ Success stories from our community  
✨ Program updates and new offerings
✨ Live masterclass announcements`,
  },

  additional: {
    "What makes Iron Lady different?": `🚀 **Iron Lady's Unique Approach**:

⚔️ **Business War Tactics** - Learn to win without fighting in corporate battles
🎯 **Results-Focused** - Breakthrough thinking and transformative results in minimal time
👥 **78,000+ Community** - Join India's largest women leaders ecosystem
🏆 **Proven Success** - Participants achieving 1+ Crore income and leadership positions

**Our Mission**: Enabling A Million Women to Reach the TOP!

We don't just teach leadership - we teach women how to navigate and win in a business world full of stereotypes, biases, and politics.`,

    "Who should join Iron Lady programs?": `👩‍💼 **Perfect for**:

🎯 **Professionals aspiring for growth** - Break through career plateaus
🏢 **Entrepreneurs & Business Women** - Scale operations and revenue  
🔄 **Women seeking career change/restart** - Transition with confidence
👑 **Aspiring C-Suite leaders** - Learn cutting-edge strategies for top positions

**Success Stories Include**:
✅ UN Ambassador Crown winner
✅ Entrepreneurs scaling operations  
✅ Professionals achieving breakthrough growth
✅ Women becoming fearlessly ambitious

If you're ready to be unapologetically ambitious and transform your career, Iron Lady is for you!`,

    "What results can I expect?": `🏆 **Transformation Results**:

💪 **Mindset Shifts**: Become unapologetically ambitious and fearless
📈 **Career Growth**: Fast-track promotions and leadership positions
💰 **Income Breakthroughs**: 100+ women achieved 1+ Crore annual income
🤝 **Network Expansion**: Access to 78,000+ women leaders community
⚔️ **Business Skills**: Master office politics, negotiations, and strategic thinking

**Participant Testimonials**:
"Iron lady = Transformation" - Surya S
"I'm already being shameless and achieving breakthroughs" - Minal Bhagat
"Used principles to win UN Ambassador Crown" - Vinath Hegde

Results depend on your commitment to implementing the strategies taught!`
  }
};

const QUICK_ACTIONS = [
  "What programs does Iron Lady offer?",
  "Program duration and format?", 
  "Contact details and social media",
  "Who are the mentors?",
  "What results can I expect?"
];

export const ChatBot = () => {
  const [userName, setUserName] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(true);
  const [tempName, setTempName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const initializeChat = (name: string) => {
    const welcomeMessage: Message = {
      id: '1',
      content: `Welcome to Iron Lady, ${name}! 👑

I'm your AI assistant, here to help you learn about our leadership programs that are **Enabling A Million Women to Reach the TOP!**

Our programs use proven **Business War Tactics** to help women overcome stereotypes, biases, and office politics. With 78,000+ women in our community, we've helped participants achieve breakthrough growth and even 1+ Crore annual incomes!

How can I help you today, ${name}?`,
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setShowNameDialog(false);
      initializeChat(tempName.trim());
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestAnswer = (question: string): string | null => {
    const lowerQuestion = question.toLowerCase();
    
    // Search through all FAQ categories
    for (const category of Object.values(IRON_LADY_FAQ)) {
      for (const [faqQuestion, answer] of Object.entries(category)) {
        const faqLower = faqQuestion.toLowerCase();
        
        // Check for direct matches or keyword matches
        if (faqLower.includes(lowerQuestion) || 
            lowerQuestion.includes(faqLower.split('?')[0]) ||
            checkKeywordMatch(lowerQuestion, faqLower)) {
          return answer;
        }
      }
    }
    
    return null;
  };

  const checkKeywordMatch = (question: string, faq: string): boolean => {
    const questionKeywords = question.split(' ').filter(word => word.length > 3);
    const faqKeywords = faq.split(' ').filter(word => word.length > 3);
    
    let matches = 0;
    questionKeywords.forEach(qWord => {
      if (faqKeywords.some(fWord => fWord.includes(qWord) || qWord.includes(fWord))) {
        matches++;
      }
    });
    
    return matches >= 2; // At least 2 keyword matches
  };

  const callGroqAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for Iron Lady, a leadership training organization that empowers women in business. Your knowledge includes:

ABOUT IRON LADY:
- Mission: Enabling A Million Women to Reach the TOP
- Community: 78,000+ women leaders ecosystem  
- Location: Bangalore, Karnataka, India
- Website: https://iamironlady.com
- LinkedIn: https://in.linkedin.com/company/iron-lady-1

PROGRAMS:
1. Leadership Essentials Program - Learn shameless pitching, deal with office politics
2. 100 Board Members Program - Fast-track career growth techniques  
3. Master of Business Warfare - C-suite strategies for 1+ Crore income
4. Leadership Masterclass - 3-day intensive workshops

KEY FEATURES:
- Business War Tactics to overcome stereotypes and biases
- Both online and offline formats available
- Certificates provided for all programs
- World-class mentors including Rajesh & team
- Success stories include UN Ambassador winners and entrepreneurs

CONTACT:
- Website: https://iamironlady.com
- LinkedIn: https://in.linkedin.com/company/iron-lady-1
- Free counselor consultations available
- Live chat support on website

Be helpful, empowering, and encouraging. Use emojis and formatting to make responses engaging. If you don't know something specific, direct them to contact Iron Lady directly.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I apologize, but I'm having trouble processing your request right now. Please try asking again or contact Iron Lady directly through their website.";
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // First try to find answer in FAQ
      let response = findBestAnswer(input.trim());
      
      // If no FAQ match found, use Groq AI with user name context
      if (!response) {
        const contextualMessage = userName ? 
          `User's name is ${userName}. Please address them by name in your response. Question: ${input.trim()}` :
          input.trim();
        response = await callGroqAPI(contextualMessage);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again or contact Iron Lady directly.",
        variant: "destructive",
      });
      
      // Fallback to FAQ if API fails
      const fallbackResponse = findBestAnswer(input.trim()) || 
        "I'm experiencing technical difficulties. Please visit https://iamironlady.com or contact our team directly for assistance with your query.";
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-iron-light/20 to-iron-accent/10">
      {/* Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-card border border-iron-accent/20 shadow-elevated">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img src={ironLadyLogo} alt="Iron Lady Logo" className="w-12 h-12 animate-iron-float" />
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-full blur-lg"></div>
              </div>
              <div>
                <DialogTitle className="text-xl font-display text-iron-dark">Welcome to Iron Lady! 👑</DialogTitle>
                <p className="text-sm text-muted-foreground font-body">Let's personalize your experience</p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium font-body">
                What's your name?
              </Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Enter your name..."
                className="mt-1 border-iron-accent/30 focus:border-iron-primary focus:ring-iron-primary/20 font-body"
                autoFocus
              />
            </div>
            <Button 
              onClick={handleNameSubmit} 
              disabled={!tempName.trim()}
              className="w-full bg-gradient-primary hover:bg-gradient-accent hover:shadow-brand transition-all duration-300 font-body font-medium"
            >
              Start Chatting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img src={ironLadyLogoWhite} alt="Iron Lady Logo" className="w-10 h-10 drop-shadow-lg" />
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg animate-iron-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Iron Lady AI Assistant</h1>
              <p className="text-primary-foreground/90 text-sm font-body">
                {userName ? `Hello ${userName}! ` : ''}Empowering Women Leaders | 78,000+ Community
              </p>
            </div>
          </div>
          
          {/* Contact Links */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-body">
            <a href="https://iamironlady.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-1 hover:text-iron-accent transition-colors">
              <Globe className="w-4 h-4" />
              Website
            </a>
            <a href="https://in.linkedin.com/company/iron-lady-1" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 hover:text-iron-accent transition-colors">
              <Phone className="w-4 h-4" />
              LinkedIn
            </a>
            <button
               onClick={() => {
                 window.open('https://www.youtube.com/results?search_query=iron+lady+leadership', '_blank', 'noopener,noreferrer');
               }}
               className="flex items-center gap-1 hover:text-iron-accent transition-colors cursor-pointer bg-transparent border-none text-inherit font-body"
            >
              <Youtube className="w-4 h-4" />
              YouTube
            </button>
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Contact via Website
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gradient-to-r from-iron-light/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-3 font-body">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="cursor-pointer hover:bg-gradient-accent hover:text-primary-foreground transition-all duration-300 hover:shadow-soft font-body"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                <Card className={cn(
                  "max-w-[80%] p-4 shadow-soft hover:shadow-brand transition-all duration-300",
                  message.role === 'user' 
                    ? 'bg-gradient-accent text-primary-foreground border-iron-accent/20' 
                    : 'bg-gradient-card border-iron-light/30 hover:border-iron-accent/30'
                )}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-body">
                    {message.content}
                  </div>
                  <div className={cn(
                    "text-xs mt-2 opacity-70 font-body",
                    message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </Card>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground animate-pulse" />
                  </div>
                </div>
                <Card className="ml-3 p-4 bg-gradient-card border-iron-light/30 shadow-soft">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-iron-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-iron-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-iron-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 bg-gradient-card border-t border-iron-light/30 shadow-soft">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Iron Lady programs, duration, mentors, or anything else..."
            className="flex-1 border-iron-light/50 focus:border-iron-primary focus:ring-iron-primary/20 font-body bg-background/80 backdrop-blur-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-primary hover:bg-gradient-accent hover:shadow-brand transition-all duration-300 hover:scale-105 font-body"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};