export const ResultsItem = ({ text, data }: { text?: string, data?: any }) => {
  return (
    <td className='p-1 md:p-2 md:px-5 md:text-center'>
      <span className="italic font-semibold w-full">{text}{text !== undefined ? ':' : ''} </span>
      <span className="">{data}</span>
    </td>
  )
}
