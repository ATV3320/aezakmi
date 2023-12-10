import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import ChainLabel from '../../components/chain-label/ChainLabel'
import chains from '../../constants/chains'
import { useAccountAbstraction } from '../../store/accountAbstractionContext'

const ChainSelector = () => {
  const { chain, setChainId } = useAccountAbstraction()

  return (
    <div>
      <FormControl fullWidth sx={{ minWidth: '150px' }}>
        <Select
          aria-label="chain selector"
          id="switch-chain-selector"
          value={chain?.id}
          onChange={(event: SelectChangeEvent) => setChainId(event.target.value as string)}
        >
          {chains.map((chain:any) => (
            <MenuItem value={chain.id} onClick={() => setChainId(chain.id)} key={chain.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <ChainLabel chain={chain} />
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default ChainSelector