/* ==========================================
   ChinaForNoobs.com - JavaScript
   Classic 90s vibes with modern functionality
   ========================================== */

// ==========================================
// Shenzhen Clock
// ==========================================
function updateShenzhenClock() {
    const clockElement = document.getElementById('shenzhen-clock');
    if (clockElement) {
        const now = new Date();
        // Shenzhen is UTC+8
        const shenzhenTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
        const hours = String(shenzhenTime.getHours()).padStart(2, '0');
        const minutes = String(shenzhenTime.getMinutes()).padStart(2, '0');
        const seconds = String(shenzhenTime.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// Update clock every second
setInterval(updateShenzhenClock, 1000);
updateShenzhenClock();

// ==========================================
// Visitor Counter (fake but fun!)
// ==========================================
function updateVisitorCount() {
    const visitorElement = document.getElementById('visitor-count');
    if (visitorElement) {
        // Get stored count or use default
        let count = localStorage.getItem('visitorCount');
        if (!count) {
            count = 48291;
        }
        // Increment by random small number to simulate traffic
        count = parseInt(count) + Math.floor(Math.random() * 3);
        localStorage.setItem('visitorCount', count);
        visitorElement.textContent = count.toLocaleString();
    }
}
updateVisitorCount();

// ==========================================
// Real-time Currency Exchange Rate
// ==========================================
async function updateExchangeRate() {
    const rateElement = document.querySelector('.exchange-rate');
    if (!rateElement) return;

    try {
        // Using frankfurter.app - free, no API key needed
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=CNY');
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        const rate = data.rates.CNY;
        
        if (rate) {
            rateElement.innerHTML = `$1 USD = ¥${rate.toFixed(2)}`;
            
            // Store in localStorage as fallback
            localStorage.setItem('usdCnyRate', rate);
            localStorage.setItem('rateLastUpdated', Date.now());
        }
    } catch (error) {
        console.log('Exchange rate API error:', error);
        
        // Try to use cached rate
        const cachedRate = localStorage.getItem('usdCnyRate');
        if (cachedRate) {
            rateElement.innerHTML = `$1 USD = ¥${parseFloat(cachedRate).toFixed(2)} CNY`;
        }
        // Otherwise keep the default static value
    }
}

// Update exchange rate on page load
updateExchangeRate();

// Refresh rate every 30 minutes (API is rate-limited)
setInterval(updateExchangeRate, 30 * 60 * 1000);

// ==========================================
// Real-time Weather for Shenzhen
// ==========================================
async function updateWeather() {
    const tempElement = document.querySelector('.big-temp');
    const weatherWidget = document.querySelector('.weather-widget');
    if (!tempElement) return;

    try {
        // Using Open-Meteo API - free, no API key needed
        // Shenzhen coordinates: 22.5431° N, 114.0579° E
        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=22.5431&longitude=114.0579&current=temperature_2m,weather_code&temperature_unit=fahrenheit'
        );
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        const tempF = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;
        
        // Get weather emoji based on WMO weather code
        const weatherEmoji = getWeatherEmoji(weatherCode);
        
        tempElement.innerHTML = `${weatherEmoji} ${tempF}°F`;
        
        // Store in localStorage as fallback
        localStorage.setItem('szWeatherTemp', tempF);
        localStorage.setItem('szWeatherCode', weatherCode);
        localStorage.setItem('weatherLastUpdated', Date.now());
        
    } catch (error) {
        console.log('Weather API error:', error);
        
        // Try to use cached weather
        const cachedTemp = localStorage.getItem('szWeatherTemp');
        const cachedCode = localStorage.getItem('szWeatherCode');
        if (cachedTemp) {
            const emoji = cachedCode ? getWeatherEmoji(parseInt(cachedCode)) : '🌡️';
            tempElement.innerHTML = `${emoji} ${cachedTemp}°F`;
        }
    }
}

// Convert WMO weather codes to emojis
function getWeatherEmoji(code) {
    if (code === 0) return '☀️';  // Clear sky
    if (code === 1 || code === 2 || code === 3) return '🌤️';  // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️';  // Fog
    if (code >= 51 && code <= 55) return '🌧️';  // Drizzle
    if (code >= 56 && code <= 57) return '🌧️';  // Freezing drizzle
    if (code >= 61 && code <= 65) return '🌧️';  // Rain
    if (code >= 66 && code <= 67) return '🌧️';  // Freezing rain
    if (code >= 71 && code <= 77) return '❄️';  // Snow
    if (code >= 80 && code <= 82) return '🌧️';  // Rain showers
    if (code >= 85 && code <= 86) return '❄️';  // Snow showers
    if (code >= 95 && code <= 99) return '⛈️';  // Thunderstorm
    return '🌡️';
}

// Update weather on page load
updateWeather();

// Refresh weather every 15 minutes
setInterval(updateWeather, 15 * 60 * 1000);

// ==========================================
// Forum Functionality
// ==========================================

// Sample posts data (in a real app, this would come from a backend)
const defaultPosts = [
    {
        id: 1,
        category: 'general',
        title: 'First time visiting Shenzhen - any tips?',
        content: 'Hey everyone! I\'m planning my first trip to Shenzhen next month. I\'m a hardware startup founder looking to connect with manufacturers. Any tips for a first-timer? Where should I stay? What should I bring?',
        author: 'Anonymous Founder',
        date: '2025-12-15',
        replies: [
            {
                author: 'SZ Veteran',
                date: '2025-12-15',
                content: 'Welcome! My biggest tip: set up WeChat and Alipay BEFORE you arrive. You literally can\'t do anything without them. Also, download a VPN!'
            },
            {
                author: 'Hardware Hacker',
                date: '2025-12-16',
                content: 'Stay near Huaqiangbei for your first trip. The energy there is INSANE. You\'ll find components you didn\'t even know existed!'
            }
        ]
    },
    {
        id: 2,
        category: 'housing',
        title: 'Best areas for short-term housing?',
        content: 'Looking to rent an apartment for 2-3 months while I work with some factories. Budget is around 5000-7000 RMB. Shekou or Nanshan? Pros and cons?',
        author: 'Digital Nomad',
        date: '2025-12-14',
        replies: [
            {
                author: 'Shekou Resident',
                date: '2025-12-14',
                content: 'Shekou is more expat-friendly with lots of Western restaurants and bars. But Nanshan puts you closer to the tech companies and Huaqiangbei. Depends on your priorities!'
            }
        ]
    },
    {
        id: 3,
        category: 'hardware',
        title: 'PCB manufacturer recommendations?',
        content: 'I need to get some prototype PCBs made quickly. Looking for a manufacturer that can do 4-layer boards with quick turnaround. Any recommendations besides JLCPCB?',
        author: 'PCB Newbie',
        date: '2025-12-13',
        replies: [
            {
                author: 'Proto Master',
                date: '2025-12-13',
                content: 'Check out PCBWay - they\'re super responsive and their quality is great. For really fast turnaround, some vendors at HQB can do same-day if you visit in person!'
            },
            {
                author: 'Factory Finder',
                date: '2025-12-14',
                content: 'Seeed Studio\'s Fusion service is excellent for prototypes. Great English support too.'
            }
        ]
    },
    {
        id: 4,
        category: 'communities',
        title: 'WeChat groups for hardware founders?',
        content: 'Looking to join some active WeChat groups for hardware founders in Shenzhen. Anyone know of good communities?',
        author: 'Community Seeker',
        date: '2025-12-12',
        replies: []
    },
    {
        id: 5,
        category: 'hardware',
        title: 'Navigating Huaqiangbei - survival guide?',
        content: 'I\'ve heard Huaqiangbei is overwhelming for first-timers. Which buildings should I visit first? Any tips for negotiating prices? I need microcontrollers, sensors, and display modules.',
        author: 'Arduino Lover',
        date: '2025-12-11',
        replies: [
            {
                author: 'HQB Regular',
                date: '2025-12-11',
                content: 'Start at SEG Plaza for basic components. For displays, go to Yuanwang. ALWAYS negotiate - start at 50% of asking price and meet in the middle. Cash or WeChat Pay only!'
            }
        ]
    }
];

// Initialize posts from localStorage or use defaults
function getPosts() {
    const stored = localStorage.getItem('forumPosts');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('forumPosts', JSON.stringify(defaultPosts));
    return defaultPosts;
}

function savePosts(posts) {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
}

// Render posts
function renderPosts(filterCategory = 'all') {
    const container = document.getElementById('posts-list');
    if (!container) return;

    const posts = getPosts();
    let filteredPosts = filterCategory === 'all' 
        ? posts 
        : posts.filter(p => p.category === filterCategory);

    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <img src="https://web.archive.org/web/20091027101804/http://www.geocities.com/ejintai/question.gif" alt="No posts" width="50">
                <p>No posts yet in this category!</p>
                <p>Be the first to ask a question! 🎉</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredPosts.map(post => `
        <div class="post" data-id="${post.id}">
            <div class="post-header">
                <span class="post-category ${post.category}">${getCategoryLabel(post.category)}</span>
                <span class="post-date">📅 ${formatDate(post.date)}</span>
            </div>
            <div class="post-title">${escapeHtml(post.title)}</div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-footer">
                <span class="post-author">👤 ${escapeHtml(post.author)}</span>
                <button class="reply-btn" onclick="showReplyForm(${post.id})">💬 Reply</button>
            </div>
            ${renderReplies(post.replies)}
            <div class="reply-form-container" id="reply-form-${post.id}" style="display: none;">
                <form onsubmit="submitReply(event, ${post.id})">
                    <div class="form-group">
                        <label>Your Name (optional - leave blank for Anonymous):</label>
                        <input type="text" id="reply-author-${post.id}" placeholder="Anonymous">
                    </div>
                    <div class="form-group">
                        <label>Your Reply: *</label>
                        <textarea id="reply-content-${post.id}" required placeholder="Share your knowledge..."></textarea>
                    </div>
                    <button type="submit" class="submit-btn">📨 Post Reply</button>
                    <button type="button" class="reply-btn" onclick="hideReplyForm(${post.id})">Cancel</button>
                </form>
            </div>
        </div>
    `).join('');
}

function renderReplies(replies) {
    if (!replies || replies.length === 0) return '';
    
    return `
        <div class="replies-container">
            ${replies.map(reply => `
                <div class="reply">
                    <div class="reply-header">
                        <span class="reply-author">👤 ${escapeHtml(reply.author)}</span>
                        <span class="reply-date">📅 ${formatDate(reply.date)}</span>
                    </div>
                    <div class="reply-content">${escapeHtml(reply.content)}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function getCategoryLabel(category) {
    const labels = {
        'general': '💬 General',
        'housing': '🏠 Housing',
        'hardware': '🔧 Hardware',
        'communities': '👥 Communities',
        'workspaces': '💼 Workspaces',
        'cafes': '☕ Cafes & Spots',
        'todos': '✅ To-Dos'
    };
    return labels[category] || '💬 General';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show/hide reply form
function showReplyForm(postId) {
    document.getElementById(`reply-form-${postId}`).style.display = 'block';
}

function hideReplyForm(postId) {
    document.getElementById(`reply-form-${postId}`).style.display = 'none';
}

// Submit new post
function submitPost(event) {
    event.preventDefault();
    
    const category = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    let author = document.getElementById('post-author').value.trim();
    
    if (!title || !content) {
        alert('Please fill in all required fields!');
        return;
    }
    
    if (!author) {
        author = 'Anonymous';
    }
    
    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        category: category,
        title: title,
        content: content,
        author: author,
        date: new Date().toISOString().split('T')[0],
        replies: []
    };
    
    posts.unshift(newPost);
    savePosts(posts);
    
    // Clear form
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-author').value = '';
    
    // Show success message
    alert('🎉 Your question has been posted! Thank you for contributing!');
    
    // Re-render posts
    renderPosts(document.getElementById('category-filter')?.value || 'all');
}

// Submit reply
function submitReply(event, postId) {
    event.preventDefault();
    
    const content = document.getElementById(`reply-content-${postId}`).value.trim();
    let author = document.getElementById(`reply-author-${postId}`).value.trim();
    
    if (!content) {
        alert('Please write a reply!');
        return;
    }
    
    if (!author) {
        author = 'Anonymous Helper';
    }
    
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.replies.push({
            author: author,
            date: new Date().toISOString().split('T')[0],
            content: content
        });
        
        savePosts(posts);
        
        // Re-render posts
        renderPosts(document.getElementById('category-filter')?.value || 'all');
        
        alert('💬 Reply posted! Thanks for helping out!');
    }
}

// Filter posts by category
function filterPosts() {
    const category = document.getElementById('category-filter').value;
    renderPosts(category);
}

// Initialize forum on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the community page
    if (document.getElementById('posts-list')) {
        renderPosts();
    }
    
    // Add form submit handler if form exists
    const postForm = document.getElementById('new-post-form');
    if (postForm) {
        postForm.addEventListener('submit', submitPost);
    }
});

// ==========================================
// Fun Extras
// ==========================================

// Random welcome messages
const welcomeMessages = [
    "欢迎! Welcome to ChinaForNoobs!",
    "🎉 You found the best Shenzhen resource!",
    "Ready to make hardware history?",
    "Shenzhen awaits, founder!",
    "加油! Let's build something amazing!"
];

// Console easter egg
console.log('%c' + welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)], 
    'font-size: 20px; color: #ff6600; font-weight: bold;');
console.log('%cBuilt with ❤️ for hardware founders', 'font-size: 12px; color: #666;');

// Konami code easter egg (up up down down left right left right b a)
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow-bg 2s linear infinite';
        alert('🎮 KONAMI CODE ACTIVATED! 🎮\n\nYou found the secret! You\'re definitely ready for Shenzhen!');
    }
});

// Add rainbow background animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow-bg {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
