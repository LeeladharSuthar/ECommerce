import { FormEvent, useState } from "react"
import AdminSideBar from "../../../components/adminDashboard/AdminSideBar"

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const numbers = "0123456789"
const symbols = "!@#$%^&*()_+-={}[]:;'<>?,./\\|\""

const Coupon = () => {
  const [size, setSize] = useState<number>(8)
  const [prefix, setPrefix] = useState<string>("")
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false)
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(true)
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>()
  const [coupon, setCoupon] = useState<string>()

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true)
  }
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCopied(false)
    if (!includeCharacters && !includeNumbers && !includeSymbols) {
      return alert("Select either to include characters, numbers or symbols")
    }
    let result: string = prefix || "";
    const loopLength: number = size - result.length
    let entireString: string = ""
    if (includeCharacters) entireString += letters
    if (includeNumbers) entireString += numbers
    if (includeSymbols) entireString += symbols
    for (let i = 0; i < loopLength; i++) {
      const randomNum: number = Math.floor(Math.random() * entireString.length)
      result += entireString[randomNum]
    }
    setCoupon(result)
  }

  return (
    <div className="adminContainer">
      <AdminSideBar />
      <main className="dashboardAppContainer">
        <h1>Coupon</h1>
        <section>
          <form onSubmit={submitHandler} className="couponForm">
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
              placeholder="Text to Include"
            />
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              placeholder="Coupon Length"
              min={8}
              max={25}
            />
            <fieldset>
              <legend>Include</legend>
              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>
            <button type="submit">Submit</button>
          </form>
          {
            coupon && <code>{coupon} <span onClick={() => copyText(coupon)}>{isCopied ? "Copied" : "Copy"}</span></code>
          }
        </section>
      </main>
    </div>
  )
}

export default Coupon