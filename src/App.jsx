import React, { useEffect, useMemo, useState, useRef } from "react";
function uid() {
  return crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
}
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  // Updated CONFIG - Longer times
  const CONFIG = {
    NORMAL: { start: 45000, color: "#10b981", name: "NORMAL" },    
    ADVENTURE: { start: 30000, color: "#f59e0b", name: "ADVENTURE" }, 
    HELL: { start: 10000, color: "#ef4444", name: "HELL" }        
  };

  const [hasSelectedMode, setHasSelectedMode] = useState(false);
  const [sufferingLevel, setSufferingLevel] = useState("NORMAL");
  const [currentInterval, setCurrentInterval] = useState(45000);
  const [tasks, setTasks] = useState([
    { id: uid(), title: "FIX PROD BUG", priority: "HIGH", updatedAt: Date.now() },
    { id: uid(), title: "EMAIL BOSS", priority: "MEDIUM", updatedAt: Date.now() },
    { id: uid(), title: "WATER PLANTS", priority: "LOW", updatedAt: Date.now() },
    { id: uid(), title: "CHECK LOGS", priority: "MEDIUM", updatedAt: Date.now() },
  ]);
  
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM ");
  const [toastMsg, setToastMsg] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showMathPopup, setShowMathPopup] = useState(false);
  const [mathQuestion, setMathQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(0);
  const [collapseColor, setCollapseColor] = useState(0);
  
  const intervalRef = useRef(null);
  const mathTimerRef = useRef(null);

  useEffect(() => {
    if (!gameOver || shakeIntensity === 0) return;
    
    let frame = 0;
    const totalFrames = 60;
    const glitchInterval = setInterval(() => {
      frame++;
      setShakeIntensity(prev => {
        const intensity = Math.sin(frame * 0.4) * 35 + Math.random() * 20;
        return Math.abs(intensity);
      });
      
      setGlitchEffect(Math.random() * 100);
      setCollapseColor(Math.random() * 360);
      
      if (frame >= totalFrames) {
        clearInterval(glitchInterval);
        setShakeIntensity(0);
        setGlitchEffect(0);
      }
    }, 33);
  }, [gameOver, shakeIntensity]);
  const saveTasks = (newTasks) => {
    localStorage.setItem('chaosTasks', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const selectMode = (mode) => {
    setSufferingLevel(mode);
    setCurrentInterval(CONFIG[mode].start);
    setHasSelectedMode(true);
    setIsPaused(false);
    setGameOver(false);
    showToast(`${CONFIG[mode].name} ENGAGED`);
  };
  const chaosEffects = [
    () => showToast("PRIORITY MATRIX SCRAMBLED"),
    () => showToast("TASK HIERARCHY COLLAPSED"), 
    () => showToast("WEIGHTING ALGORITHM MUTATED"),
    () => showToast("PRIORITY VECTOR RANDOMIZED")
  ];

  const triggerChaos = () => {
    console.log("🔥 EXECUTING CHAOS CYCLE");
    
    setTasks(prevTasks => {
      if (prevTasks.length <= 1) return prevTasks;
      
      const priorities = prevTasks.map(t => t.priority);
      const shuffledPriorities = shuffle([...priorities]);
      
      const newTasks = prevTasks.map((task, i) => ({
        ...task,
        priority: shuffledPriorities[i],
        updatedAt: Date.now()
      }));
      
      saveTasks(newTasks);
      chaosEffects[Math.floor(Math.random() * chaosEffects.length)]();
      return newTasks;
    });
  };
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!hasSelectedMode || isPaused || gameOver) return;

    intervalRef.current = setInterval(triggerChaos, currentInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentInterval, isPaused, gameOver, hasSelectedMode]);
  const generateMath = (mode) => {
    let question, correct;
    
    if (mode === "NORMAL") {
      // 2-digit + 1-digit with carry-over
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * 9) + 5;
      correct = a + b;
      question = `${a} + ${b}`;
    } else if (mode === "ADVENTURE") {
      // Mixed operations with parentheses
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 10) + 3;
      const c = Math.floor(Math.random() * 8) + 2;
      correct = (a * b) - c;
      question = `(${a} × ${b}) - ${c}`;
    } else {
      // HELL: Complex multi-step + traps
      if (Math.random() < 0.4) {
        correct = 42;
        question = "LIFE_ULTIMATE";
      } else if (Math.random() < 0.3) {
        // Algebra trap
        correct = 0;
        question = "(x-3)(x+3)";
      } else {
        const a = Math.floor(Math.random() * 12) + 8;
        const b = Math.floor(Math.random() * 10) + 6;
        const c = Math.floor(Math.random() * 8) + 3;
        const d = Math.floor(Math.random() * 5) + 2;
        correct = (a * b) + (c / d);
        question = `${a} × ${b} + ${c} ÷ ${d}`;
      }
    }

    const options = [correct];
    while (options.length < 4) {
      const wrong = correct + (Math.floor(Math.random() * 30) - 15);
      if (wrong > 0 && !options.includes(wrong) && wrong !== correct) {
        options.push(wrong);
      }
    }
    
    return { question: question + " = ?", correct, options: shuffle(options) };
  };

  const handleStopRequest = () => {
    if (gameOver || isPaused) return;
    
    if (mathTimerRef.current) clearInterval(mathTimerRef.current);
    
    const question = generateMath(sufferingLevel);
    setMathQuestion(question);
    setTimeLeft(12); // Slightly longer for harder questions
    setShowMathPopup(true);

    mathTimerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(mathTimerRef.current);
          handleMathResult(false, "TIMEOUT");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleMathResult = (isCorrect, reason = "") => {
    if (mathTimerRef.current) clearInterval(mathTimerRef.current);
    setShowMathPopup(false);

    if (isCorrect) {
      setIsPaused(true);
      showToast("AUTHORISED | CHAOS SUPPRESSED");
    } else {
      let nextInterval = currentInterval - 5000;
      
      if (currentInterval <= 5000) {
        if (currentInterval <= 1000) {
          // CAUSTIC SYSTEM COLLAPSE
          setGameOver(true);
          setTasks([]);
          setShakeIntensity(35); // More intense
          showToast("CRITICAL FAILURE | SYSTEM COLLAPSE");
          // Silent glitch sound
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAo');
          audio.volume = 0.1;
          audio.play().catch(() => {});
          return;
        }
        nextInterval = 1000;
      }

      setCurrentInterval(Math.max(1000, nextInterval));
      setIsPaused(false);
      showToast(`DENIED | CYCLE: ${Math.round(nextInterval/1000)}s`);
      triggerChaos();
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = { id: uid(), title: newTitle.trim().toUpperCase(), priority: newPriority, updatedAt: Date.now() };
    saveTasks([newTask, ...tasks]);
    setNewTitle("");
  };

  const PRIORITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const visibleTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const prioDiff = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
      return prioDiff !== 0 ? prioDiff : b.updatedAt - a.updatedAt;
    });
  }, [tasks]);

  const getPriorityColor = (priority) => ({ HIGH: "#10b981", MEDIUM: "#f59e0b", LOW: "#ef4444" })[priority];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0a0a", color: "#e2e8f0",
      fontFamily: "'SF Mono', Monaco, 'Courier New', monospace", 
      fontSize: "14px", overflow: "auto",
      transform: `translate(${shakeIntensity}px, ${shakeIntensity}px) skew(${glitchEffect / 50}deg)`,
      filter: gameOver ? `hue-rotate(${collapseColor}deg) contrast(1.3)` : "none",
      transition: shakeIntensity ? "none" : "transform 0.2s ease"
    }}>
      {/* Minimal grid - no glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", 
        background: `repeating-linear-gradient(90deg, transparent 0 2px, rgba(16,185,129,0.03) 2px 4px)`,
        opacity: gameOver ? 0.2 : 0.5,
        animation: gameOver ? "glitch 0.1s infinite" : "none"
      }}/>
      <div style={{ padding: "24px 0", borderBottom: "1px solid #334155" }}>
        <div style={{ fontSize: "20px", fontWeight: 600, color: "#f1f5f9" }}>
          PRIORITY TERMINAL [{sufferingLevel }]
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", mt: "4px" }}>
          Cycle: {Math.round(currentInterval/1000)}s | {tasks.length}t | {isPaused ? "PAUSED" : gameOver ? "COLLAPSED" : "ACTIVE"}
        </div>
      </div>
      {!hasSelectedMode && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.98)", 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          border: "1px solid #334155"
        }}>
          <div style={{ fontSize: "24px", color: "#f8fafc", mb: "40px" }}>SELECT MODE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", maxWidth: "600px" }}>
            {Object.entries(CONFIG).map(([mode, config]) => (
              <button key={mode} onClick={() => selectMode(mode)} 
                style={{
                  padding: "24px", border: `2px solid ${config.color}`, 
                  background: "rgba(15,23,42,0.8)", color: "#f1f5f9",
                  fontWeight: 500, cursor: "pointer", borderRadius: "6px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.background = config.color + "12"}
                onMouseLeave={(e) => e.target.style.background = "rgba(15,23,42,0.8)"}
              >
                {config.name}<br/>
                <small style={{ opacity: 0.7 }}>{config.start/1000}s</small>
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{
        position: "fixed", top: "120px", right: "24px", width: "260px",
        background: "rgba(15,23,42,0.95)", border: "1px solid #334155", 
        padding: "20px", borderRadius: "8px"
      }}>
        <button onClick={handleStopRequest} disabled={isPaused || gameOver}
          style={{
            width: "100%", background: isPaused ? "#1e293b" : "#ef4444", 
            color: "#f8fafc", border: "none", padding: "14px", fontWeight: 500,
            borderRadius: "6px", cursor: "pointer", mb: "16px"
          }}>
          {isPaused ? "STABLE" : "STOP CYCLE"}
        </button>
        <div style={{ color: "#eab308", fontSize: "12px", mb: "8px" }}>MODE</div>
        <select value={sufferingLevel} onChange={(e) => selectMode(e.target.value)} 
          disabled={!hasSelectedMode || gameOver}
          style={{ width: "100%", background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", padding: "10px", borderRadius: "4px" }}>
          <option value="NORMAL ">NORMAL (45s)</option>
          <option value="ADVENTURE ">ADVENTURE (30s)</option>
          <option value="HELL ">HELL (10s)</option>
        </select>
      </div>
      <div style={{ maxWidth: "700px", marginRight: "300px", paddingBottom: "100px" }}>
        <form onSubmit={addTask} style={{ mb: "24px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} disabled={gameOver}
              style={{ background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", padding: "10px", borderRadius: "4px" }}>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value.toUpperCase())} 
              placeholder="TASK" disabled={gameOver}
              style={{ flex: 1, background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", padding: "10px", borderRadius: "4px" }}/>
            <button type="submit" disabled={gameOver} style={{
              background: "#10b981", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "4px", fontWeight: 500
            }}>ADD</button>
          </div>
        </form>
 {visibleTasks.map((task, i) => (
  <div key={task.id} style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px", marginBottom: "8px"
  ,
    background: "rgba(16,185,129,0.05)", borderRadius: "4px"
  }}>
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
      <span style={{ 
        color: "#94a3b8", 
        marginRight: "20px", 
        minWidth: "45px",
        fontWeight: 500
      }}>[{String(i + 1).padStart(2, '0')}]</span>
      <span style={{ 
        color: getPriorityColor(task.priority), 
        fontWeight: 700, 
        marginRight: "32px",
        minWidth: "70px",
        textTransform: "uppercase"
      }}>{task.priority}</span>
      <span style={{ 
        color: "#94a3b8", 
        flex: 1,
        fontWeight: 400
      }}>{task.title}</span>
    </div> 
    <button onClick={() => saveTasks(tasks.filter(t => t.id !== task.id))} disabled={gameOver}
      style={{ 
        background: "none", 
        border: "1px solid #64748b", 
        color: "#64748b", 
        padding: "6px 12px", 
        borderRadius: "3px", 
        cursor: "pointer",
        fontSize: "14px"
      }}>
      ✕
    </button>
  </div>
))}
      </div>
      {showMathPopup && mathQuestion && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "420px", background: "rgba(15,23,42,0.98)", border: "2px solid #10b981",
          padding: "32px", borderRadius: "8px", textAlign: "center"
        }}>
          <div style={{ color: "#eab308", fontSize: "20px", mb: "12px" }}>AUTH CHECK</div>
          <div style={{ color: "#ef4444", fontSize: "18px", mb: "24px" }}>{timeLeft}s</div>
          <div style={{ color: "#10b981", fontSize: "36px", fontWeight: 600, mb: "32px" }}>
            {mathQuestion.question}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {mathQuestion.options.map((opt, i) => (
              <button key={i} onClick={() => handleMathResult(opt === mathQuestion.correct)}
                style={{
                  padding: "20px", background: "rgba(16,185,129,0.1)", color: "#e2e8f0",
                  border: "1px solid #10b981", borderRadius: "6px", fontSize: "20px", fontWeight: 500, cursor: "pointer"
                }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {toastMsg && (
        <div style={{
          position: "fixed", top: "24px", right: "24px",
          background: "rgba(16,185,129,0.15)", border: "1px solid #10b981",
          color: "#e2e8f0", padding: "12px 20px", borderRadius: "6px",
          fontSize: "13px"
        }}>
          {toastMsg}
        </div>
      )}
      {gameOver && (
        <div style={{
          position: "fixed", inset: 0, 
          background: `linear-gradient(45deg, hsl(${collapseColor}, 70%, 10%), hsl(${collapseColor + 60}, 80%, 8%))`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", border: "1px solid #991b1b"
        }}>
          <div style={{ 
            fontSize: "48px", fontWeight: 700, color: "#fee2e2", mb: "24px",
            textShadow: "0 0 10px currentColor",
            animation: "glitch-text 0.15s infinite"
          }}>SYSTEM COLLAPSE</div>
          <div style={{ fontSize: "18px", color: "#fca5a5", mb: "40px", maxWidth: "500px" }}>
            CRITICAL PRIORITY FAILURE<br/>ALL TASKS TERMINATED
          </div>
          <button onClick={() => window.location.reload()} style={{
            background: "#10b981", color: "#0f172a", border: "none",
            padding: "14px 32px", fontSize: "16px", fontWeight: 600, borderRadius: "6px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.4)"
          }}>
            REBOOT TERMINAL
          </button>
        </div>
      )}
      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-2px, 2px); }
          20% { transform: translate(2px, -2px); }
          30% { transform: translate(-1px, 1px) skew(2deg); }
          40% { transform: translate(1px, -1px) skew(-1deg); }
          50% { transform: translate(-2px, 2px) scale(1.01); }
          60% { transform: translate(2px, -2px) scale(0.99); }
          70% { transform: translate(-1px, 1px) skew(1deg); }
        }        
        @keyframes glitch-text {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-1px, 1px); }
          20% { transform: translate(1px, -1px); }
          30% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          50% { transform: translate(0, 0) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
