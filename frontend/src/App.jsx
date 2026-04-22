import { useState } from "react";
import "./App.css";

const TONES = [
  { id: "casual", label: "Casual Hinglish", emoji: "💬" },
  { id: "funny", label: "Funny / Meme-y", emoji: "😂" },
  { id: "motivational", label: "Motivational", emoji: "🔥" },
  { id: "dramatic", label: "Dramatic", emoji: "🎭" },
];

const VIDEO_TYPES = [
  { value: "story", label: "Storytelling" },
  { value: "tutorial", label: "Tutorial / How-to" },
  { value: "vlog", label: "Vlog / Personal" },
  { value: "motivation", label: "Motivational" },
  { value: "facts", label: "Facts / Educational" },
];

const DURATIONS = [
  { value: "short", label: "Short · 3-5 min" },
  { value: "medium", label: "Medium · 7-10 min" },
  { value: "long", label: "Long · 12-15 min" },
];

export default function App() {
  const [topic, setTopic] = useState("");
  const [vtype, setVtype] = useState("story");
  const [duration, setDuration] = useState("medium");
  const [tone, setTone] = useState("casual");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) { setError("Arre, topic toh likho pehle!"); return; }
    setError(""); setScript(null); setLoading(true);
    try {
      const res = await fetch("https://riya-thakur2-yt-script-backend.hf.space/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, video_type: vtype, duration, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setScript(data.script);
      setTimeout(() => document.getElementById("output")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e.message || "Kuch gadbad ho gayi. Retry karo!");
    } finally { setLoading(false); }
  }

  function buildFullText() {
    if (!script) return "";
    let t = `TITLE: ${script.title}\n\nHOOK:\n${script.hook}\n\nINTRO:\n${script.intro}\n\n`;
    (script.main_sections || []).forEach(s => { t += `${s.heading.toUpperCase()}:\n${s.content}\n\n`; });
    return t + `CTA:\n${script.cta}`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="root">
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      <header className="header">
        <div className="hinner">
          <div className="logo">YT</div>
          <div><h1 className="htitle">Script Generator</h1><p className="hsub">Topic do · Hinglish script lo · Viral ho jao</p></div>
          <div className="hbadge">✦ AI · Free</div>
        </div>
      </header>
      <main className="main">
        <div className="fcol">
          <div className="card">
            <p className="card-head">✍️ Script Details</p>
            <div className="field">
              <div className="lrow"><label className="lbl">Video ka topic kya hai?</label><span className="cc">{topic.length}/200</span></div>
              <textarea className="ta" value={topic} maxLength={200} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Ek student ne hostel se startup kaise banaya..." rows={4}/>
            </div>
            <div className="twocol">
              <div className="field">
                <label className="lbl">Video type</label>
                <div className="sw"><select className="sel" value={vtype} onChange={e=>setVtype(e.target.value)}>{VIDEO_TYPES.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select><span className="sarr">▾</span></div>
              </div>
              <div className="field">
                <label className="lbl">Duration</label>
                <div className="sw"><select className="sel" value={duration} onChange={e=>setDuration(e.target.value)}>{DURATIONS.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}</select><span className="sarr">▾</span></div>
              </div>
            </div>
            <div className="field">
              <label className="lbl">Tone choose karo</label>
              <div className="tgrid">{TONES.map(t=><button key={t.id} className={`tpill${tone===t.id?" tactive":""}`} onClick={()=>setTone(t.id)}><span>{t.emoji}</span>{t.label}</button>)}</div>
            </div>
            {error && <div className="errbox">⚠ {error}</div>}
            <button className={`gbtn${loading?" btnload":""}`} onClick={handleGenerate} disabled={loading}>
              {loading?<span className="binner"><span className="spin"/>Script likh raha hoon...</span>:<span className="binner">✦ Generate Script</span>}
            </button>
          </div>
          <div className="card tipscard">
            <p className="tipsh">💡 Pro Tips</p>
            <ul className="tipsl">
              <li>Emotion add karo — <em>"Ek ladki ne..."</em> beats <em>"How to earn"</em></li>
              <li>Specific raho — <em>"3 mahine mein 50k"</em> is more clickable</li>
              <li>Storytelling tone sabse engaging hoti hai Hinglish mein</li>
            </ul>
          </div>
        </div>
        <div className="ocol" id="output">
          {!script&&!loading&&(
            <div className="card phcard">
              <div className="phicon">🎬</div>
              <p className="phtitle">Tera script yahan aayega</p>
              <p className="phsub">Topic daal ke Generate karo — poori Hinglish script ready ho jaayegi seconds mein!</p>
            </div>
          )}
          {script&&(
            <div className="card ocard">
              <div className="ohead">
                <div className="mpills"><span className="mpill">{script.estimated_duration}</span><span className="mpill">{VIDEO_TYPES.find(v=>v.value===vtype)?.label}</span><span className="mpill">{TONES.find(t=>t.id===tone)?.label}</span></div>
                <div className="oacts"><button className="ibtn" onClick={handleCopy}>{copied?"✓ Copied!":"⎘ Copy"}</button><button className="ibtn" onClick={()=>setScript(null)}>✕ Clear</button></div>
              </div>
              <h2 className="stitle">{script.title}</h2>
              <div className="secs">
                <Sec tag="HOOK" color="peach" icon="🎣" content={script.hook}/>
                <Sec tag="INTRO" color="sky" icon="👋" content={script.intro}/>
                {(script.main_sections||[]).map((s,i)=><Sec key={i} tag={s.heading} color="sky" icon="▶" content={s.content}/>)}
                <Sec tag="CTA" color="mint" icon="📣" content={script.cta}/>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Sec({tag,color,icon,content}){
  const [open,setOpen]=useState(true);
  return(
    <div className="sec">
      <button className="shead" onClick={()=>setOpen(!open)}>
        <span className="sleft"><span>{icon}</span><span className={`stag c-${color}`}>{tag}</span></span>
        <span className="stog">{open?"▲":"▼"}</span>
      </button>
      {open&&<p className="sbody">{content}</p>}
    </div>
  );
}
