export const Label = ({ question, htmlFor }: { question: string, htmlFor: string }) => {
  return (
    <label className='' htmlFor={htmlFor}>
      {question}
    </label>
  )
}
