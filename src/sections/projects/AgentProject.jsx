import ProjectSection from '../../components/ProjectSection.jsx';

export default function AgentProject() {
  return (
    <ProjectSection id="project-agent">
      <h3>minimal-agent — an LLM agent loop with no framework</h3>
      <div className="tagline">Plan → execute (with tools) → reflect</div>
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
        A working agent built to visualize sequenced LLM calls with different system prompts sharing one
        piece of state: the message history. Built without LangChain, using only the <code>anthropic</code>{' '}
        SDK. It's structured as three runnable stages, each adding one concept, so you can see exactly what
        "tools + a loop" and "reflection" look like.
      </p>

      <p>
        Tools return errors as data, not exceptions, so an error string goes back into the message history
        where the model reads it and retries, which creates a self-healing loop. Reflection is a separate call
        with a clean transcript and the real tool-call log, since a model reviewing its own in-context answer
        approves it out of routine. The tool log lets the reviewer catch the model quietly doing math instead
        of calling the calculator. The calculator itself parses an AST and whitelists arithmetic nodes rather
        than calling <code>eval()</code> on model output.
      </p>

      <h4>Stack</h4>
      <p>Python, Anthropic SDK. Hard caps on turns and reflection rounds keep the loop bounded.</p>
    </ProjectSection>
  );
}
