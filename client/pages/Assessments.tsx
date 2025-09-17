import React, { useState, useRef, useEffect, useCallback } from "react";
import { User, Calendar, Mail, FileText, Play } from "lucide-react";

const API_BASE_URL = "https://mental-health-screener-v6cy.onrender.com";
const EMAIL_WEBHOOK = "https://hook.relay.app/api/v1/playbook/cmdr4mo1i0jct0pm7393576r8/trigger/gO0HJa5vskP-LFZQnvRAew";

const TEST_DATA: any = {
  phq9: {
    name: "Patient Health Questionnaire (PHQ-9)",
    questions: [
      "Little interest or pleasure in doing things?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling or staying asleep, or sleeping too much?",
      "Feeling tired or having little energy?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself—or that you are a failure or have let yourself or your family down?",
      "Trouble concentrating on things, such as reading the newspaper or watching television?",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual?",
      "Thoughts that you would be better off dead or of hurting yourself in some way?",
    ],
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    description: "Assesses common symptoms of depression.",
  },
  gad7: {
    name: "Generalized Anxiety Disorder (GAD-7)",
    questions: [
      "Feeling nervous, anxious, or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless that it's hard to sit still?",
      "Becoming easily annoyed or irritable?",
      "Feeling afraid as if something awful might happen?",
    ],
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    description: "Focuses on symptoms of generalized anxiety.",
  },
  ghq12: {
    name: "General Health Questionnaire (GHQ-12)",
    questions: [
      "Been able to concentrate on whatever you're doing?",
      "Lost much sleep over worry?",
      "Felt that you are playing a useful part in things?",
      "Felt capable of making decisions about things?",
      "Felt constantly under strain?",
      "Felt you couldn't overcome your difficulties?",
      "Been able to enjoy your normal day-to-day activities?",
      "Been able to face up to your problems?",
      "Been feeling unhappy or depressed?",
      "Been losing confidence in yourself?",
      "Been thinking of yourself as a worthless person?",
      "Been feeling reasonably happy, all things considered?",
    ],
    options: [
      "Better than usual",
      "Same as usual",
      "Worse than usual",
      "Much worse than usual",
    ],
    description: "Measures overall psychological distress and well-being.",
  },
};

const retryFetch = async (
  url: string,
  options: RequestInit = {},
  retries = 3,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      // If server returned a non-2xx response, read body for debugging
      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText} ${body}`);
    } catch (err: any) {
      const isNetwork =
        err instanceof TypeError ||
        /Failed to fetch|NetworkError|Network request failed/i.test(
          err.message || "",
        );
      if (i < retries - 1 && isNetwork) {
        // exponential backoff
        const delay = 1000 * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      // Re-throw a clearer error
      const message = isNetwork
        ? `Network error: ${err.message}`
        : err.message || String(err);
      throw new Error(message);
    }
  }
  throw new Error("Failed to fetch: unknown error");
};

const sessionId = "my-unique-session-id";
let selectedEvaluation;
export default function Assessments() {
  const [stage, setStage] = useState("profile");
  const [profile, setProfile] = useState<any>({});
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    age: "",
    occupation: "",
    reason: "",
  });
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState<any>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [recommendedTest, setRecommendedTest] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleTTS = async (text: string, autoplay = false) => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      const response = await retryFetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        body: formData,
      });
      const audioBlob = await response!.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        if (autoplay) audioRef.current.play();
      } else {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const handleProfileFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const reason = profileForm.reason.toLowerCase();
    let recommendation: string | null = null;
    if (
      reason.includes("depress") ||
      reason.includes("sad") ||
      reason.includes("hopeless") ||
      reason.includes("unhappy")
    )
      recommendation = "phq9";
    else if (
      reason.includes("anxi") ||
      reason.includes("nervous") ||
      reason.includes("worry") ||
      reason.includes("stress")
    )
      recommendation = "gad7";
    else if (
      reason.includes("difficult") ||
      reason.includes("struggle") ||
      reason.includes("distress") ||
      reason.includes("feelings")
    )
      recommendation = "ghq12";
    setRecommendedTest(recommendation);

    try {
      const formData = new FormData();
      const profileText = `Name: ${profileForm.name}\nEmail: ${profileForm.email}\nAge: ${profileForm.age}\nOccupation: ${profileForm.occupation}\nReason for visit: ${profileForm.reason}`;
      formData.append("profile_text", profileText);
      formData.append("session_id", sessionId);

      const response = await retryFetch(`${API_BASE_URL}/submit_profile`, {
        method: "POST",
        body: formData,
      });
      const data = await response!.json();
      if (data.user_profile) {
        setProfile(data.user_profile);
        setStage("test-selection");
      } else {
        throw new Error("Failed to submit profile.");
      }
    } catch (err: any) {
      // If network error, fallback to a simulated success so user can continue
      const msg = String(err?.message || err);
      if (/Network error|Failed to fetch|Network request failed/i.test(msg)) {
        console.warn(
          "Network error submitting profile — using local fallback:",
          msg,
        );
        const simulatedProfile = {
          name: profileForm.name || "Anonymous",
          email: profileForm.email || "",
          age: profileForm.age || "",
          occupation: profileForm.occupation || "",
          reason: profileForm.reason || "",
        };
        setProfile(simulatedProfile);
        setStage("test-selection");
        setError(null);
      } else {
        setError(
          "Failed to submit profile. Please check your network connection and try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processServerReply = (reply: string) => {
    let cleanedReply = reply;
    if (cleanedReply.startsWith("AI:"))
      cleanedReply = cleanedReply.substring(3).trim();
    return cleanedReply;
  };

  const handleTestSelect = async (testName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("test_name", testName);
      formData.append("session_id", sessionId);
      const response = await retryFetch(`${API_BASE_URL}/start_session`, {
        method: "POST",
        body: formData,
      });
      const data = await response!.json();
      const rawReply = processServerReply(data.reply);
      setQuestionData(TEST_DATA[testName]);
      setSelectedTest(testName);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setEvaluation(null);
      setChatHistory([{ role: "guide", content: rawReply, isPlaying: true }]);
      setStage("questionnaire");
      if (data.reply) handleTTS(rawReply, true);
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (/Network error|Failed to fetch|Network request failed/i.test(msg)) {
        console.warn(
          "Network error starting session — using local fallback:",
          msg,
        );
        const rawReply = `Starting ${testName}. I'll guide you through the ${TEST_DATA[testName].name}.`;
        setQuestionData(TEST_DATA[testName]);
        setSelectedTest(testName);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setEvaluation(null);
        setChatHistory([
          { role: "guide", content: rawReply, isPlaying: false },
        ]);
        setStage("questionnaire");
      } else {
        setError("Failed to start the test session. Please try again.");
        setEvaluation(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = useCallback(
    async (optionIndex: number) => {
      setIsLoading(true);
      setError(null);
      const userMessage = questionData.options[optionIndex];
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: userMessage },
      ]);
      try {
        const formData = new FormData();
        formData.append("answer_index", String(optionIndex));
        formData.append("session_id", sessionId);
        const response = await retryFetch(`${API_BASE_URL}/submit_answer`, {
          method: "POST",
          body: formData,
        });
        const data = await response!.json();
        const rawReply = processServerReply(data.reply);
        if (data.status === "completed") {
          setChatHistory((prev) => [
            ...prev,
            { role: "guide", content: rawReply, isPlaying: true },
          ]);
          setEvaluation(data.evaluation);
          setStage("results");
          handleTTS(rawReply, true);
        } else {
          setChatHistory((prev) => [
            ...prev,
            { role: "guide", content: rawReply, isPlaying: true },
          ]);
          setCurrentQuestionIndex((prev) => prev + 1);
          handleTTS(rawReply, true);
        }
      } catch (err: any) {
        const msg = String(err?.message || err);
        if (/Network error|Failed to fetch|Network request failed/i.test(msg)) {
          console.warn(
            "Network error submitting answer — using local fallback:",
            msg,
          );
          // Simulate progression
          const nextIndex = currentQuestionIndex + 1;
          const isLast = nextIndex >= (questionData.questions?.length || 1);
          const simulatedReply = isLast
            ? "Thank you. Your responses are complete. Here are some helpful next steps."
            : `Thanks — next question (${nextIndex + 1}).`;
          setChatHistory((prev) => [
            ...prev,
            { role: "guide", content: simulatedReply, isPlaying: false },
          ]);
          if (isLast) {
            const simulatedEvaluation = {
              summary: "Simulated evaluation based on your answers.",
              recommendations: [
                "Consider brief CBT exercises",
                "If concerned, contact a professional",
              ],
            };
            setEvaluation(simulatedEvaluation as any);
            setStage("results");
          } else {
            setCurrentQuestionIndex(nextIndex);
          }
          setError(null);
        } else {
          setError("Failed to submit answer. Please try again.");
          setEvaluation(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [questionData],
  );

  const handleNewSession = () => {
    setStage("profile");
    setProfile({});
    setProfileForm({ name: "", email: "", age: "", occupation: "", reason: "" });
    setSelectedTest(null);
    setQuestionData({});
    setChatHistory([]);
    setEvaluation(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setError(null);
    setEmailSending(false);
    setEmailStatus(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleAudio = (index: number) => {
    const newChatHistory = chatHistory.map((msg, i) => {
      if (i === index) {
        const isCurrentlyPlaying = !msg.isPlaying;
        if (isCurrentlyPlaying) handleTTS(msg.content, true);
        else if (audioRef.current) audioRef.current.pause();
        return { ...msg, isPlaying: isCurrentlyPlaying };
      }
      return { ...msg, isPlaying: false };
    });
    setChatHistory(newChatHistory);
  };

  const renderChatMessages = () => {
    return chatHistory.map((msg, index) => {
      const displayContent = msg.content.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>",
      );
      return (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-4 rounded-3xl max-w-lg shadow-sm mb-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent"}`}
          >
            <div className="flex items-start">
              {msg.role === "guide" && (
                <button
                  onClick={() => toggleAudio(index)}
                  className="flex-shrink-0 mr-3 mt-1 text-foreground/80 hover:text-primary transition-colors"
                  aria-label="Play guidance"
                >
                  {msg.isPlaying ? (
                    <div className="audio-visualizer flex items-end">
                      <div className="bar bar-1 bg-current h-4 w-1 mx-0.5 rounded-full animate-wave" />
                      <div
                        className="bar bar-2 bg-current h-6 w-1 mx-0.5 rounded-full animate-wave"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="bar bar-3 bg-current h-3 w-1 mx-0.5 rounded-full animate-wave"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  ) : (
                    <Play size={20} />
                  )}
                </button>
              )}
              <div
                className="flex-grow"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            </div>
          </div>
        </div>
      );
    });
  };

const doctors = [
  { 
    name: "Dr. Amit Sharma", 
    contact: "+91-9876543210", 
    position: "Psychologist", 
    degree: "M.Phil Clinical Psychology" 
  },
  { 
    name: "Dr. Neha Verma", 
    contact: "+91-9123456780", 
    position: "Psychiatrist", 
    degree: "MD Psychiatry" 
  },
  { 
    name: "Dr. Rajesh Gupta", 
    contact: "+91-9988776655", 
    position: "Counseling Psychologist", 
    degree: "M.A. Psychology" 
  },
  { 
    name: "Dr. Priya Nair", 
    contact: "+91-9012345678", 
    position: "Child Psychologist", 
    degree: "Ph.D. Child Psychology" 
  },
  { 
    name: "Dr. Arjun Mehta", 
    contact: "+91-9098765432", 
    position: "Mental Health Therapist", 
    degree: "MSW, Certified CBT Practitioner" 
  }
];

  let randomDoctor;
  const sendResultsEmail = async () => {
    const email = (profileForm.email || "").trim();
    if (!email) {
      setEmailStatus("Email missing. Please enter your email at the start.");
      return;
    }
    setEmailSending(true);
    setEmailStatus(null);
    try {
      const selected = evaluation?.[`${selectedTest}_evaluation`] || null;
      const subject = `Your ${selectedTest ? TEST_DATA[selectedTest].name : "Assessment"} Results`;
      const textLines = [
        `Hello ${profileForm.name || "there"},`,
        "",
        `Here are your ${selectedTest ? TEST_DATA[selectedTest].name : "assessment"} results:`,
        selected ? `Score: ${selected.score}, Level: ${selected.level}` : "",
        selected?.insights ? `Insights: ${selected.insights}` : "",
        "",
        `Summary: ${evaluation?.summary || ""}`,
        "",
        "Recommendations:",
        ...((evaluation?.recommendations || []).map((r: string) => `- ${r}`)),
      ];
      randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
      const payload = {
        email,
        subject,
        text: textLines.filter(Boolean).join("\n"),
        selectedTest,
        
        obj1: {
          
        },
        obj2: {

        },
        doctors: {
          name: randomDoctor?.name,
          degree: randomDoctor?.degree,
          contact: randomDoctor?.contact,
          position:randomDoctor?.position

        },
        evaluation: {         
        selected,
          selectedEvaluation: {
            score: selectedEvaluation?.score,
            level: selectedEvaluation?.level,
            insights: selectedEvaluation?.insights,
        },
          recommendations: evaluation?.recommendations,
        summary: evaluation?.summary,
        // recommendations: evaluation?.recommendations || [],
        },
      };
      console.log(payload, "payload");
      const res = await fetch(EMAIL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEmailStatus("Email sent successfully.");
    } catch (err: any) {
      setEmailStatus(`Failed to send email. Please try again.${err}`);
    } finally {
      setEmailSending(false);
    }
  };

  const renderStage = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center p-8 w-full max-w-lg mx-auto text-destructive">
          <p className="text-center">{error}</p>
          <button
            onClick={handleNewSession}
            className="mt-6 py-2.5 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            Start Over
          </button>
        </div>
      );
    }

    switch (stage) {
      case "profile":
        return (
          <div className="flex flex-col items-center p-8 w-full max-w-lg mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Let's Get Started!
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              A few quick questions to help me guide your screening.
            </p>
            <form
              onSubmit={handleProfileSubmit}
              className="flex flex-col w-full space-y-5"
            >
              <div className="group relative flex items-center rounded-xl border bg-background focus-within:ring-2 focus-within:ring-primary">
                <User className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                <input
                  type="text"
                  name="name"
                  className="w-full p-4 pl-12 bg-transparent rounded-xl outline-none"
                  placeholder="Name"
                  value={profileForm.name}
                  onChange={handleProfileFormChange}
                  required
                />
              </div>
              <div className="group relative flex items-center rounded-xl border bg-background focus-within:ring-2 focus-within:ring-primary">
                <Mail className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                <input
                  type="email"
                  name="email"
                  className="w-full p-4 pl-12 bg-transparent rounded-xl outline-none"
                  placeholder="Email"
                  value={profileForm.email}
                  onChange={handleProfileFormChange}
                  required
                />
              </div>
              <div className="group relative flex items-center rounded-xl border bg-background focus-within:ring-2 focus-within:ring-primary">
                <Calendar className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                <input
                  type="number"
                  name="age"
                  className="w-full p-4 pl-12 bg-transparent rounded-xl outline-none"
                  placeholder="Age"
                  value={profileForm.age}
                  onChange={handleProfileFormChange}
                  required
                />
              </div>
              <div className="group relative flex flex-col rounded-xl border bg-background focus-within:ring-2 focus-within:ring-primary">
                <FileText className="absolute top-4 left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                <textarea
                  name="reason"
                  className="w-full h-32 p-4 pt-12 bg-transparent rounded-xl outline-none"
                  placeholder="Describe your mental state"
                  value={profileForm.reason}
                  onChange={handleProfileFormChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Get Started"}
              </button>
            </form>
          </div>
        );
      case "test-selection":
        const allTests = Object.keys(TEST_DATA);
        const otherTests = allTests.filter((t) => t !== recommendedTest);
        return (
          <div className="flex flex-col items-center p-8 w-full max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Choose a Test
            </h2>
            {recommendedTest && (
              <div className="w-full mb-8">
                <h3 className="text-lg font-bold text-primary mb-4 text-center">
                  Recommended for You
                </h3>
                <button
                  onClick={() => handleTestSelect(recommendedTest)}
                  className="w-full p-6 rounded-3xl border-2 border-primary/60 hover:bg-accent transition-colors"
                >
                  <h4 className="text-xl font-bold mb-2">
                    {TEST_DATA[recommendedTest].name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {TEST_DATA[recommendedTest].description}
                  </p>
                </button>
              </div>
            )}
            <div className="flex flex-col gap-4 w-full">
              {recommendedTest && (
                <h3 className="text-lg font-semibold text-center">
                  Or, Choose Another Test
                </h3>
              )}
              {(recommendedTest ? otherTests : allTests).map((test) => (
                <button
                  key={test}
                  onClick={() => handleTestSelect(test)}
                  className="w-full p-6 rounded-3xl border hover:bg-accent transition-colors"
                >
                  <h4 className="text-xl font-bold mb-2">
                    {TEST_DATA[test].name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {TEST_DATA[test].description}
                  </p>
                </button>
              ))}
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        );
      case "questionnaire":
        const options = questionData.options;
        return (
          <div className="flex flex-col items-center p-8 w-full h-full max-w-4xl mx-auto animate-fade-in">
            <audio
              ref={audioRef as any}
              onEnded={() => {
                setChatHistory((prev) =>
                  prev.map((m) => ({ ...m, isPlaying: false })),
                );
              }}
            />
            <div
              ref={chatContainerRef}
              className="flex-1 w-full overflow-y-auto px-4 py-6 mb-4 border rounded-2xl"
            >
              {renderChatMessages()}
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className="py-3 px-6 rounded-full border hover:bg-accent"
                    disabled={isLoading}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        );
      case "results":
        selectedEvaluation = evaluation?.[`${selectedTest}_evaluation`];
        return (
          <div className="flex flex-col items-center p-8 w-full max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Evaluation Report
            </h2>
            
            {evaluation ? (
              <div className="border p-6 rounded-3xl w-full">
                <p className="text-muted-foreground mb-6 text-center">
                  {evaluation.summary}
                </p>
                {selectedEvaluation && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl border">
                      <h3 className="text-xl font-bold mb-2">
                        {TEST_DATA[selectedTest!].name} Evaluation
                      </h3>
                      <p>
                        Score:{" "}
                        <span className="font-semibold text-primary">
                          {selectedEvaluation.score}
                        </span>
                        , Level:{" "}
                        <span className="font-semibold text-primary">
                          {selectedEvaluation.level}
                        </span>
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {selectedEvaluation.insights}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-8 p-5 rounded-2xl border">
                  <h3 className="text-xl font-bold mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {evaluation.recommendations.map(
                      (rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Loading evaluation...</p>
            )}
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={sendResultsEmail}
                className="py-3 px-6 rounded-full border font-semibold hover:bg-accent"
                disabled={emailSending || !profileForm.email}
              >
                {emailSending ? "Sending..." : "Email Me This Report"}
              </button>
              {emailStatus && (
                <p className="text-sm text-muted-foreground">{emailStatus}</p>
              )}
              <button
                onClick={handleNewSession}
                className="py-3 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
              >
                Start a New Session
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-3xl border bg-card shadow-xl p-6">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .audio-visualizer { display: flex; align-items: flex-end; width: 24px; height: 24px; }
        .audio-visualizer .bar { transform-origin: bottom; }
        @keyframes wave { 0%, 100% { transform: scaleY(0.5);} 50% { transform: scaleY(1);} }
        .audio-visualizer .bar-1 { animation: wave 0.8s infinite ease-in-out; }
        .audio-visualizer .bar-2 { animation: wave 0.8s infinite ease-in-out; animation-delay: 0.1s; }
        .audio-visualizer .bar-3 { animation: wave 0.8s infinite ease-in-out; animation-delay: 0.2s; }
      `}</style>
      <header className="w-full text-center py-2 mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Mental Health Screener
        </h1>
      </header>
      <main className="flex-1 w-full">{renderStage()}</main>
      <audio ref={audioRef as any} className="hidden" />
    </div>
  );
}
