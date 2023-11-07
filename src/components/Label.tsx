export const Label = ({ question }: { question: string }) => {
  return (
    <label className='col-span-3' htmlFor="">
      {question}
    </label>
  )
}
