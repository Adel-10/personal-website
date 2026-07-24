// Full-viewport chapter scene shown before each project on the Projects page.
// The Projects page's ScrollTrigger setup pins it and plays: giant outlined
// number rises → title assembles character by character → kicker fades in →
// whole scene shrinks away as the project card arrives.
export default function ChapterIntro({ num, title, kicker, hue }) {
  return (
    <section className="chapter" style={hue ? { '--ch': hue } : undefined}>
      <div className="wrap">
        <div className="ch-num" aria-hidden="true">{num}</div>
        <h2 className="ch-title">{title}</h2>
        <p className="ch-kicker">{kicker}</p>
      </div>
    </section>
  );
}
