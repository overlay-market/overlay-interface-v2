import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { erc20Abi } from 'viem'
import styled from 'styled-components'

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

const ERC20_TEST_ADDRESS = '0x3E27fAe625f25291bFda517f74bf41DC40721dA2'

export default function TestERC20() {
  const { address: account } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const { writeContract, isPending } = useWriteContract()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!account || !recipient || !amount) return

    // Convertir el número decimal a BigInt
    const amountInWei = BigInt(Math.floor(Number(amount) * 10 ** 18))

    writeContract(
      {
        address: ERC20_TEST_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountInWei],
      },
      {
        onSuccess: (hash) => {
          console.log('Transaction hash:', hash)
        },
        onError: (error) => {
          console.error('Transaction error:', error)
        },
      }
    )
  }

  return (
    <Container>
      <h1>Test ERC20 Transfer</h1>
      <Form onSubmit={handleSubmit}>
        <div>
          <label>Recipient Address:</label>
          <Input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </div>
        <div>
          <label>Amount:</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to transfer"
            step="0.000000000000000001"
          />
        </div>
        <Button type="submit" disabled={!account || isPending}>
          {isPending ? 'Transferring...' : 'Transfer'}
        </Button>
      </Form>
    </Container>
  )
}
