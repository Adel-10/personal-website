import ProjectSection from '../../components/ProjectSection.jsx';

export default function AgentProject() {
  return (
    <ProjectSection id="project-agent">
      <h3>minimal-agent — an LLM agent loop with no framework</h3>
      <div className="tagline">Plan → execute (with tools) → reflect, in ~230 lines of pure Python</div>
      <div className="links">
        <a href="https://github.com/Adel-10/minimal-agent" target="_blank" rel="noopener noreferrer">github.com/Adel-10/minimal-agent →</a>
      </div>

      <div className="bigstats">
        <div className="bigstat">
          <span className="num" data-count="230" data-prefix="~">~230</span>
          <span className="lbl">lines of pure Python</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="3">3</span>
          <span className="lbl">runnable stages — diff them</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="0">0</span>
          <span className="lbl">frameworks — just the SDK</span>
        </div>
      </div>

      <p>
        A working agent built to understand what an "agent" actually is: sequenced LLM calls with different
        system prompts sharing one piece of state (the message history). No LangChain — just the{' '}
        <code>anthropic</code> SDK. It's structured as three runnable stages, each adding one concept, so
        you can <code>diff</code> consecutive files to see exactly what "tools + a loop" and "reflection"
        cost in code.
      </p>

      <p>
        Design decisions worth calling out: tools return errors as data, not exceptions — an error string
        goes back into the message history where the model reads it and retries, which is the difference
        between a brittle loop and a self-healing one. Reflection is a separate call with a clean transcript
        and the real tool-call log, because a model reviewing its own in-context answer rubber-stamps it —
        and the tool log lets the reviewer catch the model quietly doing mental math instead of calling the
        calculator. The calculator itself parses an AST and whitelists arithmetic nodes rather than calling{' '}
        <code>eval()</code> on model output.
      </p>

      <h4>Stack</h4>
      <p>Python, Anthropic SDK. Hard caps on turns and reflection rounds keep the loop bounded.</p>
    </ProjectSection>
  );
}
