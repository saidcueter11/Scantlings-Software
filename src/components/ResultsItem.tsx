export const ResultsItem = ({ text, data }: { text?: string, data?: any }) => {
  return (
    <td className='p-2 px-5 text-center'>
      <span className="italic font-semibold w-full">{text}{text !== undefined ? ':' : ''} </span>
      <span className="">{data}</span>
    </td>
  )
}
