import { ThemeProvider } from '../../store/themeContext'
import { AccountAbstractionProvider } from '../../store/accountAbstractionContext'

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <ThemeProvider>
      <AccountAbstractionProvider>{children}</AccountAbstractionProvider>
    </ThemeProvider>
  )
}

export default Providers
