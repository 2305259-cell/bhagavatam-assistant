"use strict";

// ============================================
// BHAGWATAM ASSISTANT
// Chatbot + feelings + spiritual guidance + audio
// ============================================

const chatForm = document.getElementById("chat-form");
const questionInput = document.getElementById("question");
const chatBox = document.getElementById("chat-box");
const micButton = document.getElementById("mic-button");
const speakButton = document.getElementById("speak-button");

const audioList = document.getElementById("audio-list");
const audioPlayer = document.getElementById("audio-player");
const nowPlaying = document.getElementById("now-playing");
const status = document.getElementById("status");

let lastAnswer = "";
let currentTrackIndex = -1;

// ============================================
// 1. AUDIO LIBRARY: ALL 19 TRACKS
// ============================================

const tracks = [
    "CDJ-2_Round_1.mp3",
    "CDJ-2_Round_1 (1).mp3",
    "CDJ-2_Round_1 (2).mp3",
    "CDJ-2_Round_1 (3).mp3",
    "CDJ-2_Round_1 (4).mp3",
    "CDJ-2_Round_1 (5).mp3",
    "CDJ-2_Round_1 (6).mp3",
    "CDJ-2_Round_1 (7).mp3",
    "CDJ-2_Round_1 (8).mp3",
    "CDJ-2_Round_1 (9).mp3",
    "CDJ-2_Round_1 (10).mp3",
    "CDJ-2_Round_1 (11).mp3",
    "CDJ-2_Round_1 (12).mp3",
    "CDJ-2_Round_1 (13).mp3",
    "CDJ-2_Round_1 (14).mp3",
    "CDJ-2_Round_1 (15).mp3",
    "Japa_-_by_Example.mp3",
    "Japa_-_Group_Japa.mp3",
    "Japa_-_Group_Japa_with_Shenai.mp3"
];

// Properly handles spaces and parentheses in filenames.


function getAudioPath(filename) {
    return new URL(
        "./" + filename.split("/").map(encodeURIComponent).join("/"),
        document.baseURI
    ).href;
}



// ============================================
// 2. CHAT MESSAGE DISPLAY
// ============================================

function addMessage(message, sender) {
    const paragraph = document.createElement("p");

    paragraph.className =
        sender === "user" ? "user-message" : "bot-message";

    paragraph.textContent = message;

    chatBox.appendChild(paragraph);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendAnswer(answer) {
    lastAnswer = answer;
    addMessage(answer, "bot");
}

// ============================================
// 3. SPIRITUAL KNOWLEDGE BASE
// These are paraphrased explanations, not direct
// quotations from scripture.
// ============================================

const knowledge = [

    // GREETINGS
    {
        keywords: ["hello", "hi", "hey", "namaste", "hare krishna"],
        answer: "🙏 Hare Krishna! Welcome to Bhagwatam Assistant. You can ask me about love, devotion, heartbreak, sadness, anxiety, relationships, inner peace, Krishna and the Bhagavad Gita. Tell me what is on your mind."
    },
    {
        keywords: ["thank you", "thanks"],
        answer: "🌸 You are most welcome! May you find peace, strength and clarity on your journey. Hare Krishna!"
    },

    // LOVE
    {
        keywords: ["what is true love", "what is love", "meaning of love", "real love"],
        answer: "❤️ Love is more than attraction or possession. It includes care, honesty, respect, patience and wishing for another person's well-being. The Bhagavad Gita encourages compassion, self-awareness and freedom from selfish attachment. Healthy love should not require you to lose your dignity or accept mistreatment."
    },
    {
        keywords: ["one sided love", "one-sided love", "unrequited love"],
        answer: "💗 One-sided love can be painful. Your feelings are real, but you cannot control another person's feelings. You can care about someone while respecting their choices and protecting your own peace. The Gita's teaching about non-attachment can help you love sincerely without making your entire happiness depend on one outcome."
    },
    {
        keywords: ["heartbreak", "broken heart", "breakup", "break up"],
        answer: "💙 Heartbreak can make the future feel empty. Give yourself time to grieve instead of forcing yourself to be okay immediately. The Bhagavad Gita teaches that circumstances change and encourages steadiness through life's difficulties. A relationship ending does not end your worth. Take one day at a time and seek support from someone you trust."
    },
    {
        keywords: ["how to forget someone", "cannot forget someone", "can't forget someone", "move on"],
        answer: "🌷 You do not need to erase every memory to move forward. Allow memories to exist without letting them control your choices. Reduce habits that reopen the wound, take care of yourself and return your attention to the present. Healing often happens gradually."
    },
    {
        keywords: ["attachment", "too attached", "emotional attachment", "possessive"],
        answer: "🪷 Attachment becomes painful when we believe we cannot be happy without a particular person or outcome. Non-attachment does not mean becoming cold. It means loving sincerely while respecting freedom, boundaries and the reality that life changes."
    },
    {
        keywords: ["relationship problems", "relationship advice", "relationship confusion"],
        answer: "💞 A healthy relationship needs honesty, respect, communication and effort from both people. Ask whether both of you feel safe, valued and heard. Spirituality is not a reason to tolerate manipulation or disrespect. Think calmly about the situation instead of reacting only from fear."
    },
    {
        keywords: ["cheating", "betrayal", "cheated on", "trust broken"],
        answer: "💔 Betrayal can make it difficult to trust again. Give yourself time before making major decisions. Acknowledge what happened, establish boundaries and decide what is healthy for you. Forgiveness does not require returning to an unhealthy relationship."
    },
    {
        keywords: ["jealousy", "jealous", "envy"],
        answer: "🌱 Jealousy can arise from fear, comparison or insecurity. Notice the feeling without letting it control your actions. The Gita encourages self-mastery and freedom from envy. Another person's success or relationship does not reduce your value."
    },
    {
        keywords: ["forgiveness", "how to forgive", "cannot forgive"],
        answer: "🕊️ Forgiveness can mean releasing the desire to remain trapped in resentment. It does not mean pretending that harm never happened. You can forgive at your own pace while keeping boundaries and holding people accountable."
    },
    {
        keywords: ["soulmate", "life partner", "marriage"],
        answer: "💍 A healthy partnership grows through trust, shared values, responsibility, kindness and mutual respect. Spirituality can help you reflect on character and intention, but it cannot guarantee that one particular person is destined for you. Notice how someone consistently treats you."
    },

    // SADNESS AND LONELINESS
    {
        keywords: ["i am sad", "i feel sad", "feeling sad", "sadness", "why am i sad"],
        answer: "💙 I am sorry you are feeling sad. You do not need to solve everything right now. Take a slow breath, drink some water and allow yourself to acknowledge what hurts. The Gita teaches that experiences change. If you feel comfortable, tell me what has been making you sad."
    },
    {
        keywords: ["loneliness", "lonely", "i feel alone", "nobody understands me", "no one understands me"],
        answer: "🤍 Feeling lonely can hurt even when people are around you. Your feelings deserve attention. Spiritual reflection can help you explore your deeper identity, and reaching out to one trusted person may help you feel less alone. You deserve connection, care and support."
    },
    {
        keywords: ["crying", "i want to cry", "cannot stop crying", "can't stop crying"],
        answer: "💙 It is okay to cry. Having emotions does not make you weak. Give yourself a little time, breathe gently and contact someone you trust if you need company. You do not have to face overwhelming feelings alone."
    },
    {
        keywords: ["empty inside", "feeling empty", "nothing makes me happy", "lost interest in everything"],
        answer: "🤍 Feeling empty can be exhausting. Start with small acts of care: eating something, resting, getting fresh air or speaking to someone you trust. Spiritual practice may provide meaning, but persistent emptiness deserves care too. If this continues or affects daily life, consider speaking with a mental health professional."
    },
    {
        keywords: ["depression", "depressed", "hopeless", "no hope"],
        answer: "💙 I am sorry things feel so heavy. You do not have to force yourself to be positive. Please consider telling someone you trust how you feel and contacting a mental health professional, especially if these feelings persist. Depression is not a personal or spiritual failure."
    },

    // ANXIETY AND OVERTHINKING
    {
        keywords: ["overthinking", "overthink", "thinking too much", "racing thoughts"],
        answer: "🌿 Overthinking often happens when the mind repeatedly tries to solve an uncertain future. Bhagavad Gita 6.26 describes bringing the wandering mind back again and again. Write down what is worrying you, identify what you can control and choose one small action you can take now."
    },
    {
        keywords: ["anxiety", "anxious", "nervous", "feeling worried", "worrying too much"],
        answer: "🌼 When you feel anxious, try making your next step smaller. Breathe gently and separate what you know from what you fear might happen. The Gita encourages steadiness and thoughtful action. If anxiety interferes with daily life, consider speaking with a qualified mental health professional."
    },
    {
        keywords: ["fear of future", "future worries", "i am scared", "afraid", "fear"],
        answer: "🪷 Fear is a human response to uncertainty. Courage does not mean never feeling afraid; it means choosing a thoughtful next step despite fear. Focus on what you can do today instead of trying to control every possible future."
    },
    {
        keywords: ["control my mind", "control the mind", "restless mind", "mind is restless"],
        answer: "🧘 Bhagavad Gita 6.26 teaches that when the mind wanders, we should gently bring it back. Krishna also discusses practice and detachment. Begin with a short daily practice, such as quietly observing your breathing, and return patiently whenever your attention drifts."
    },

    // ANGER, EGO AND PATIENCE
    {
        keywords: ["control anger", "i am angry", "i feel angry", "anger", "getting angry"],
        answer: "🔥 Anger can arise when we feel hurt, threatened or frustrated. Bhagavad Gita 2.62–63 describes how dwelling on desires can contribute to attachment, frustration and disturbed judgment. Pause before responding, breathe slowly and identify what is underneath your anger."
    },
    {
        keywords: ["ego", "pride", "arrogance"],
        answer: "🌱 A healthy sense of self is different from believing you are always right. Spiritual growth encourages humility, self-awareness and respect for others. You can stand up for yourself while remaining open to learning and admitting mistakes."
    },
    {
        keywords: ["patience", "impatient", "waiting for something"],
        answer: "🌸 Patience does not mean doing nothing. It means taking the right actions while allowing time for things that cannot be rushed. Focus on steady effort, wise decisions and what is within your control."
    },
    {
        keywords: ["hatred", "hate someone", "resentment"],
        answer: "🕊️ Hatred can keep your attention tied to the very thing that hurt you. You do not have to approve of someone's behaviour to work toward inner peace. Establish boundaries, acknowledge your pain and avoid allowing resentment to decide your future."
    },

    // SELF-WORTH AND LIFE PURPOSE
    {
        keywords: ["self love", "love myself", "self worth", "my worth", "i am not enough"],
        answer: "🌸 Self-love means treating yourself with care, honesty and dignity. Your worth is not determined only by grades, appearance, income, popularity or whether someone chooses you. Improve yourself without treating yourself cruelly."
    },
    {
        keywords: ["purpose of life", "meaning of life", "my purpose", "why am i here"],
        answer: "🌞 The Bhagavad Gita explores dharma, self-knowledge, devotion and meaningful action. Start by asking what responsibilities are yours, what values matter to you and how you can contribute to others. Purpose often becomes clearer through thoughtful action."
    },
    {
        keywords: ["failure", "i failed", "i am a failure", "failed in exam"],
        answer: "🌱 Failure is an experience, not your entire identity. Bhagavad Gita 2.47 emphasizes acting sincerely without treating results as completely within your control. Review what happened, learn what you can and choose your next step. You can acknowledge a mistake without deciding you are worthless."
    },
    {
        keywords: ["exam stress", "exam fear", "study stress", "examination"],
        answer: "📚 Focus on preparation rather than repeatedly imagining the result. Break your syllabus into small tasks, practise questions and take reasonable breaks. The Gita's teaching on action without excessive attachment to results can remind you to give your sincere effort without allowing one exam to define your whole life."
    },
    {
        keywords: ["motivation", "no motivation", "feeling unmotivated"],
        answer: "🌻 You do not need to feel motivated every moment. Choose one small task and work on it for ten minutes. The Gita emphasizes sincere action and responsibility. Consistency can help you move forward even when inspiration is low."
    },
    {
        keywords: ["comparison", "compare myself", "everyone is ahead", "people are better than me"],
        answer: "🌿 Comparing your whole life with someone else's visible success can make you forget your progress. Learn from others when useful, but measure your growth against your previous self and your own values."
    },
    {
        keywords: ["regret", "past mistakes", "guilt", "i made a mistake"],
        answer: "🌷 Regret can help you recognize what needs to change, but endless self-punishment cannot rewrite the past. Acknowledge the mistake, make amends where possible, learn from it and choose a better action now."
    },
    {
        keywords: ["success", "what is success", "successful life"],
        answer: "🌞 Success can include achievement, but also integrity, growth, service and peace of mind. Work sincerely toward meaningful goals and learn from the outcome without letting one result determine your entire identity."
    },

    // DEVOTION AND SPIRITUAL PRACTICE
    {
        keywords: ["what is devotion", "meaning of devotion", "what is bhakti", "meaning of bhakti", "bhakti"],
        answer: "🌸 Bhakti means devotion or loving dedication to the Divine. In the Bhagavad Gita, devotion involves sincerity, remembrance, trust and offering one's actions to God. It is not only a feeling; it can also shape how we treat others and fulfil our responsibilities."
    },
    {
        keywords: ["how to become devoted", "increase devotion", "become spiritual"],
        answer: "🙏 Begin with small, sincere practices. Read a little scripture, chant or pray regularly, reflect on what you learn and practise kindness in daily life. Devotion is not measured only by how emotional you feel. Consistency, sincerity and the way you live also matter."
    },
    {
        keywords: ["surrender to god", "how to surrender", "faith in god", "trust god"],
        answer: "🙏 In the Bhagavad Gita, surrender involves trusting the Divine and orienting your life toward that relationship. It does not mean giving up thoughtful action or responsibility. You can pray, reflect, act according to your values and accept that some outcomes remain beyond your control."
    },
    {
        keywords: ["how to pray", "prayer", "chanting", "japa", "hare krishna mantra"],
        answer: "🙏 Prayer and japa can be sincere practices of remembrance and devotion. Find a quiet moment, repeat a sacred name or prayer attentively and return your focus gently when it wanders. Begin with sincerity rather than expecting an extraordinary experience."
    },
    {
        keywords: ["how to meditate", "meditation", "meditate"],
        answer: "🧘 Sit comfortably, breathe naturally and bring your attention to your breath, a prayer or a sacred name. When the mind wanders, gently return to your chosen focus. The Bhagavad Gita discusses meditation as a disciplined practice; consistency matters more than forcing your mind to become perfectly silent."
    },
    {
        keywords: ["what is detachment", "non attachment", "non-attachment", "detachment"],
        answer: "🪷 Detachment does not have to mean indifference. It means caring and acting responsibly without demanding complete control over other people or every outcome. The Gita encourages sincere effort while letting go of excessive attachment to results."
    },
    {
        keywords: ["what is dharma", "meaning of dharma", "my duty"],
        answer: "📖 Dharma can refer to duty, righteous conduct and the principles that sustain a meaningful life. The Gita encourages reflection on responsibilities and acting with integrity. Applying dharma to a difficult situation requires considering context, consequences and the well-being of those affected."
    },
    {
        keywords: ["what is karma", "meaning of karma", "karma"],
        answer: "🌱 Karma means action and is also associated with the consequences of action. The Bhagavad Gita emphasizes performing responsibilities thoughtfully without becoming enslaved by the desire to control every result."
    },

    // KRISHNA, GITA AND BHAGAVATAM
    {
        keywords: ["who is krishna", "about krishna"],
        answer: "🙏 In the Vaishnava tradition, Krishna is worshipped as the Supreme Personality of Godhead. In the Bhagavad Gita, He guides Arjuna through confusion and teaches about duty, spiritual knowledge, devotion and the nature of the self."
    },
    {
        keywords: ["what is bhagavad gita", "about gita", "bhagavad gita"],
        answer: "📖 The Bhagavad Gita is a dialogue between Krishna and Arjuna on the battlefield of Kurukshetra. It explores duty, moral conflict, the self, disciplined action, meditation, knowledge and devotion. Its teachings invite readers to reflect on difficult decisions and how to act with wisdom."
    },
    {
        keywords: ["what is bhagavatam", "srimad bhagavatam", "bhagavatam"],
        answer: "📚 The Srimad Bhagavatam is a sacred Vaishnava text exploring devotion to the Divine, especially Krishna, through stories, teachings and philosophical discussions."
    },
    {
        keywords: ["what is soul", "who am i", "atma", "eternal soul"],
        answer: "🪷 The Bhagavad Gita describes the self, or atman, as distinct from the temporary physical body. This teaching invites reflection on identity beyond appearance, possessions and changing circumstances. Different philosophical traditions interpret the relationship between the individual self and the Divine differently."
    },
    {
        keywords: ["fear of death", "what happens after death", "death"],
        answer: "🪷 The Bhagavad Gita discusses the changing body and the enduring self, presenting death within a broader spiritual understanding of existence. People and traditions hold different beliefs about death. If this question comes from grief or fear, it is okay to talk about those feelings too."
    },
    {
        keywords: ["why do bad things happen", "why is life unfair", "life is unfair"],
        answer: "🌧️ It is natural to ask why painful things happen. The Gita offers spiritual perspectives on duty, change and responding wisely to hardship, but we should not assume that every painful event has an obvious explanation. You can seek meaning while also asking for practical help."
    },
    {
        keywords: ["god is testing me", "why god gives pain", "god has abandoned me"],
        answer: "🤍 When life hurts, it can feel as though God is distant. I cannot know why a particular hardship has happened or claim that it is a divine test. You can bring your doubts honestly into prayer, seek support and take practical steps to care for yourself."
    },
    {
        keywords: ["how to be happy", "happiness", "lasting happiness"],
        answer: "🌼 Happiness can come from relationships, meaningful work, gratitude, service, spiritual practice and caring for your health. The Gita explores deeper well-being cultivated through wisdom and discipline. You do not need to feel happy all the time to live meaningfully."
    },
    {
        keywords: ["good person", "be a better person", "kindness"],
        answer: "🌸 Practise honesty, compassion, patience, humility and responsibility in ordinary situations. Spiritual growth is not about appearing perfect; it is about noticing your actions, learning from mistakes and sincerely trying to reduce harm."
    },

    // AUDIO COMMANDS
    {
        keywords: ["pause music", "pause audio"],
        answer: "AUDIO_PAUSE"
    },
    {
        keywords: ["resume music", "resume audio"],
        answer: "AUDIO_RESUME"
    },
    {
        keywords: ["stop music", "stop audio"],
        answer: "AUDIO_STOP"
    },

    // GENERAL HELP
    {
        keywords: ["help me", "i need help", "talk to me"],
        answer: "🤍 I am here to listen and help you reflect. You can tell me what happened, how you are feeling or what question is troubling you. I can offer general spiritual reflections, though I am not a substitute for professional or emergency support."
    }
];

// ============================================
// 4. FIND AN ANSWER
// ============================================

function getAnswer(question) {
    const text = question.toLowerCase().trim();

    // Handle common audio commands.
    if (text.includes("pause music") || text.includes("pause audio")) {
        audioPlayer.pause();
        return "Your audio has been paused. 🎧";
    }

    if (text.includes("resume music") || text.includes("resume audio")) {
        if (!audioPlayer.src) {
            return "Please choose an audio track first.";
        }

        audioPlayer.play().catch(function (error) {
            console.error("Could not resume audio:", error);
            status.textContent = "Press Play on the audio player to resume.";
        });

        return "Trying to resume your audio.";
    }

    if (text.includes("stop music") || text.includes("stop audio")) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        return "Your audio has stopped.";
    }

    // Find the most relevant prepared answer.
    const match = knowledge.find(function (item) {
        return item.answer !== "AUDIO_PAUSE" &&
            item.answer !== "AUDIO_RESUME" &&
            item.answer !== "AUDIO_STOP" &&
            item.keywords.some(function (keyword) {
                return text.includes(keyword);
            });
    });

    if (match) {
        return match.answer;
    }

    return "🌸 Thank you for your question. I do not have a prepared answer for that exact wording yet. Try asking about love, heartbreak, attachment, sadness, loneliness, anxiety, overthinking, devotion, forgiveness, inner peace, karma, Krishna or the Bhagavad Gita.";
}

// ============================================
// 5. CHAT FORM
// ============================================

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) return;

    addMessage(question, "user");

    const answer = getAnswer(question);
    sendAnswer(answer);

    questionInput.value = "";
    questionInput.focus();
});

// ============================================
// 6. READ THE LAST ANSWER ALOUD
// ============================================

speakButton.addEventListener("click", function () {
    if (!("speechSynthesis" in window)) {
        alert("Text-to-speech is not supported in this browser.");
        return;
    }

    if (!lastAnswer) {
        lastAnswer = "Hare Krishna! Ask me a question.";
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(lastAnswer);
    speech.lang = "en-IN";
    speech.rate = 0.95;

    window.speechSynthesis.speak(speech);
});

// ============================================
// 7. MICROPHONE INPUT
// ============================================

micButton.addEventListener("click", function () {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported in this browser. Please type your question.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micButton.textContent = "Listening...";

    recognition.onresult = function (event) {
        questionInput.value = event.results[0][0].transcript;
        chatForm.requestSubmit();
    };

    recognition.onerror = function (event) {
        console.error("Microphone error:", event.error);
        alert("Microphone problem. Check your browser permissions and try again.");
    };

    recognition.onend = function () {
        micButton.textContent = "🎤";
    };

    try {
        recognition.start();
    } catch (error) {
        console.error("Could not start microphone:", error);
        micButton.textContent = "🎤";
        alert("Could not start the microphone. Please try again.");
    }
});

// ============================================
// 8. AUDIO PLAYER
// ============================================

function renderTracks() {
    audioList.innerHTML = "";

    tracks.forEach(function (filename, index) {
        const row = document.createElement("div");
        row.className = "track-item";

        const name = document.createElement("span");
        name.textContent = "Track " + (index + 1) + ": " + filename;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "▶ Play";

        button.addEventListener("click", async function () {
            currentTrackIndex = index;

            audioPlayer.pause();
            audioPlayer.src = getAudioPath(filename);
            audioPlayer.load();

            nowPlaying.textContent = "Selected: " + filename;
            status.textContent = "Loading recording...";

            try {
                await audioPlayer.play();
                nowPlaying.textContent = "Now playing: " + filename;
                status.textContent = "Recording playing.";
            } catch (error) {
                console.error("Audio playback failed:", error);
                console.error("Audio URL:", audioPlayer.currentSrc);

                status.textContent =
                    "Could not play this file. Check the audio folder and filename.";
            }
        });

        row.appendChild(name);
        row.appendChild(button);
        audioList.appendChild(row);
    });
}

// Report missing files, unsupported formats or loading errors.
audioPlayer.addEventListener("error", function () {
    console.error("Audio URL:", audioPlayer.currentSrc);
    console.error(
        "Audio error code:",
        audioPlayer.error ? audioPlayer.error.code : "unknown"
    );

    status.textContent =
        "Audio could not load. Check that the MP3 exists inside the audio folder.";
});

audioPlayer.addEventListener("canplay", function () {
    status.textContent = "Recording ready to play.";
});

// Automatically play the next track after one finishes.
audioPlayer.addEventListener("ended", async function () {
    const nextIndex = currentTrackIndex + 1;

    if (nextIndex >= tracks.length) {
        currentTrackIndex = -1;
        nowPlaying.textContent = "Playlist finished.";
        status.textContent = "You have reached the end of the audio library.";
        return;
    }

    currentTrackIndex = nextIndex;
    const filename = tracks[currentTrackIndex];

    audioPlayer.src = getAudioPath(filename);
    audioPlayer.load();

    nowPlaying.textContent = "Now playing: " + filename;
    status.textContent = "Loading next recording...";

    try {
        await audioPlayer.play();
    } catch (error) {
        console.error("Next track could not play:", error);
        status.textContent = "Click Play to start the next track.";
    }
});

// Display all 19 tracks.
renderTracks();

console.log("Bhagwatam Assistant loaded successfully.");
console.log("Audio tracks available:", tracks.length);