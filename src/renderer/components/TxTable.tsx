import { GWEI_TO_WEI } from 'logic/consts';
export function TxTable(props: any) {
  return (
    <div className="table-container relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Tx
            </th>
            <th scope="col" className="px-6 py-3">
              From
            </th>
            <th scope="col" className="px-6 py-3">
              Max fee
            </th>
            <th scope="col" className="px-6 py-3">
              Max priority fee
            </th>
          </tr>
        </thead>
        <tbody>
          {props.pendingTable.map((tx: any) => {
            return (
              <tr
                key={tx['hash']}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <a
                    target="_blank"
                    href={`https://etherscan.io/tx/${tx['hash']}`}
                  >{`${tx['hash'].substring(0, 6)}...${tx['hash']?.substring(
                    tx['hash'].length - 6,
                    tx['hash'].length
                  )}`}</a>
                </th>
                <td className="px-6 py-4">
                  {`${tx['from'].substring(0, 6)}...${tx['from']?.substring(
                    tx['from'].length - 6,
                    tx['from'].length
                  )}`}
                </td>
                <td className="px-6 py-4">
                  {tx['maxFeePerGas'].toNumber() / GWEI_TO_WEI}
                </td>
                <td className="px-6 py-4">
                  {tx['maxPriorityFeePerGas'].toNumber() / GWEI_TO_WEI}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
