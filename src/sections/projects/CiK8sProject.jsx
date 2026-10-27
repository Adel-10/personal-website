import ProjectSection from '../../components/ProjectSection.jsx';

export default function CiK8sProject() {
  return (
    <ProjectSection id="project-cik8s">
      <h3>ci-k8s — CI/CD pipeline to Kubernetes</h3>
      <div className="tagline">Jenkins → Docker → Kubernetes: a service shipped the way ops teams ship</div>
      <div className="links">
        <a href="https://github.com/Adel-10/ci-k8s" target="_blank" rel="noopener noreferrer">github.com/Adel-10/ci-k8s →</a>
      </div>

      <div className="bigstats">
        <div className="bigstat">
          <span className="num" data-count="3">3</span>
          <span className="lbl">pipeline stages — Jenkins → Docker → K8s</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="2">2</span>
          <span className="lbl">replicas behind a Service</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="2">2</span>
          <span className="lbl">probes — readiness + liveness</span>
        </div>
      </div>

      <p>
        A Node.js service taken through a full delivery pipeline: Jenkins builds and tags a Docker image by
        git SHA, pushes it to a registry, and rolls it out to a Kubernetes Deployment (2 replicas,
        readiness/liveness probes) behind a Service. Implemented to understand shipping models and
        demonstrated end to end.
      </p>

      <h4>Stack</h4>
      <p>Node.js, Docker, Jenkins, Kubernetes (Deployments, Services, probes).</p>
    </ProjectSection>
  );
}
