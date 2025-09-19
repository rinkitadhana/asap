import AIToolCard from "./AIToolCard"

const AIToolsSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">AI Tools</h1>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((index) => (
          <AIToolCard key={index} />
        ))}
      </div>
    </div>
  )
}

export default AIToolsSection
