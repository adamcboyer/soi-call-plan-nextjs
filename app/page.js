"use client";
import { useState, useEffect } from 'react';

// Weekly information containing focus, script, and quote for each week
const WEEKLY_INFO = [
  {
    title: 'Week 1',
    focus: 'Practice tone & transition',
    script:
      "Hey [Name], just wanted to check in and see how you're doing. By the way, I'm now doing real estate alongside seminary. My goal is just to be a resource when people have questions about homes or the market.",
    quote: 'The journey of a thousand miles begins with one step.',
  },
  {
    title: 'Week 2',
    focus: 'Gather emails',
    script:
      "Hi [Name], how are you? I'd love to keep you in the loop—what’s the best email for you?",
    quote: 'Consistency breeds success.',
  },
  {
    title: 'Week 3',
    focus: 'Ask curiosity-driven questions',
    script:
      "Hi [Name], how are things going in your neighborhood? Have you noticed more homes selling around you lately?",
    quote: 'Questions are the engines of intellect.',
  },
  {
    title: 'Week 4',
    focus: 'Offer value',
    script:
      "Hi [Name], would it be helpful if I put together a quick home value update for you? Many of my friends have been surprised at what their homes are worth today.",
    quote: 'Value is delivered by understanding needs.',
  },
];

// The main page component
export default function Home() {
  // Define daily call targets for 30 days. Week 1: 2 calls/day; Week 2: 3 calls/day; Week 3: 4 calls/day; Week 4: 5 calls/day.
  const dailyTargets = Array.from({ length: 30 }, (_, i) => {
    if (i < 7) return 2;
    if (i < 14) return 3;
    if (i < 21) return 4;
    return 5;
  });

  // State to track which calls have been completed. This is an array of arrays of booleans.
  const [checks, setChecks] = useState([]);
  // State to track reflection notes for each week
  const [reflections, setReflections] = useState([]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // Load checks
    const savedChecks = typeof window !== 'undefined' ? localStorage.getItem('soiChecks') : null;
    if (savedChecks) {
      try {
        const parsed = JSON.parse(savedChecks);
        setChecks(parsed);
      } catch {
        // If parsing fails, initialize checks with false values
        const initial = dailyTargets.map((target) => Array.from({ length: target }, () => false));
        setChecks(initial);
      }
    } else {
      const initial = dailyTargets.map((target) => Array.from({ length: target }, () => false));
      setChecks(initial);
    }
    // Load reflections
    const savedReflections = typeof window !== 'undefined' ? localStorage.getItem('soiReflections') : null;
    if (savedReflections) {
      try {
        const parsed = JSON.parse(savedReflections);
        setReflections(parsed);
      } catch {
        setReflections(Array.from({ length: 4 }, () => ''));
      }
    } else {
      setReflections(Array.from({ length: 4 }, () => ''));
    }
  }, []);

  // Save checks to localStorage whenever they change
  useEffect(() => {
    if (checks.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('soiChecks', JSON.stringify(checks));
    }
  }, [checks]);

  // Save reflections to localStorage whenever they change
  useEffect(() => {
    if (reflections.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('soiReflections', JSON.stringify(reflections));
    }
  }, [reflections]);

  // Toggle a specific call checkbox
  const toggleCheck = (dayIndex, callIndex) => {
    setChecks((prev) => {
      return prev.map((calls, i) => {
        if (i === dayIndex) {
          return calls.map((val, j) => (j === callIndex ? !val : val));
        }
        return calls;
      });
    });
  };

  // Compute total calls and completed calls for progress calculation
  const totalCalls = dailyTargets.reduce((acc, val) => acc + val, 0);
  const completedCalls = checks.reduce((acc, day) => acc + day.filter((c) => c).length, 0);
  const progress = (completedCalls / totalCalls) * 100;

  // Define week ranges (0-based indexing). Each object has start and end indices (inclusive)
  const weeks = [
    { start: 0, end: 6 },
    { start: 7, end: 13 },
    { start: 14, end: 20 },
    { start: 21, end: 29 },
  ];

  // Compute progress for each week
  const weeklyProgress = weeks.map(({ start, end }) => {
    const target = dailyTargets
      .slice(start, end + 1)
      .reduce((acc, val) => acc + val, 0);
    const completed = checks
      .slice(start, end + 1)
      .reduce((acc, day) => acc + day.filter((c) => c).length, 0);
    const percent = (completed / target) * 100;
    return { target, completed, percent };
  });

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1>SOI 30-Day Call Plan</h1>
      {/* Overall progress bar */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            background: '#eee',
            borderRadius: '6px',
            overflow: 'hidden',
            height: '12px',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: '#4caf50',
              height: '100%',
            }}
          ></div>
        </div>
        <p>
          {Math.round(progress)}% complete ({completedCalls}/{totalCalls} calls)
        </p>
      </div>
      {/* Daily tracker table */}
      <h2>Daily Call Tracker</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}
            >
              Day
            </th>
            <th
              style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}
            >
              Calls
            </th>
          </tr>
        </thead>
        <tbody>
          {dailyTargets.map((target, dayIndex) => (
            <tr key={dayIndex}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                Day {dayIndex + 1}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {checks[dayIndex] &&
                  checks[dayIndex].map((val, callIndex) => (
                    <label key={callIndex} style={{ marginRight: '8px' }}>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() => toggleCheck(dayIndex, callIndex)}
                        style={{ marginRight: '4px' }}
                      />
                      {callIndex + 1}
                    </label>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Weekly summary and focus */}
      <h2 style={{ marginTop: '40px' }}>Weekly Summary & Focus</h2>
      {WEEKLY_INFO.map((info, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
          }}
        >
          <h3>{info.title}</h3>
          <p>
            <strong>Focus:</strong> {info.focus}
          </p>
          <p>
            <strong>Script:</strong> {info.script}
          </p>
          <p>
            <strong>Quote:</strong> {info.quote}
          </p>
          <p>
            <strong>Progress:</strong> {Math.round(weeklyProgress[i].percent)}% ({
              weeklyProgress[i].completed
            }
            /{weeklyProgress[i].target} calls)
          </p>
          <label style={{ display: 'block', marginTop: '10px' }}>
            <strong>Reflection Notes:</strong>
            <textarea
              value={reflections[i] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setReflections((prev) => {
                  const newRef = [...prev];
                  newRef[i] = val;
                  return newRef;
                });
              }}
              style={{ width: '100%', minHeight: '80px', marginTop: '4px' }}
              placeholder={`Reflect on ${info.title}...`}
            ></textarea>
          </label>
        </div>
      ))}
    </div>
  );
}
