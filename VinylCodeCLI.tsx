'use client'

import { useState, useEffect, useRef } from 'react'
import { Terminal } from 'lucide-react'

export default function VinylCodeCLI() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([
    'Welcome to VinylCode - Create your song with code!',
    'Type "help" for available commands.',
  ])
  const [songCode, setSongCode] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [output])

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input)
      setInput('')
    }
  }

  const processCommand = (cmd: string) => {
    setOutput((prev) => [...prev, `> ${cmd}`])

    switch (cmd.toLowerCase()) {
      case 'help':
        setOutput((prev) => [
          ...prev,
          'Available commands:',
          '  create - Go to Muse to create your song',
          '  paste - Paste your song code',
          '  submit - Submit your song code to Google Sheets',
          '  preview - Preview your current song code',
          '  clear - Clear the terminal',
          '  vinyl - Show vinyl image',
        ])
        break
      case 'create':
        setOutput((prev) => [
          ...prev,
          'Redirecting to Muse...',
          'Create your song there and copy the code.',
          'When done, use the "paste" command to input your code.',
        ])
        window.open('https://muse.hackclub.dev/', '_blank')
        break
      case 'paste':
        setOutput((prev) => [
          ...prev,
          'Please paste your song code below:',
          'Type "end" on a new line when finished.',
        ])
        break
      case 'end':
        if (songCode) {
          setOutput((prev) => [...prev, 'Song code received. Use "submit" to send it to Google Sheets.'])
        } else {
          setOutput((prev) => [...prev, 'No song code entered. Use "paste" to input your code.'])
        }
        break
      case 'submit':
        if (songCode) {
          setOutput((prev) => [
            ...prev,
            'Submitting your song code to Google Sheets...',
          ])
          submitToGoogleSheets(songCode)
        } else {
          setOutput((prev) => [...prev, 'No song code entered. Use "paste" to input your code first.'])
        }
        break
      case 'preview':
        if (songCode) {
          setOutput((prev) => [
            ...prev,
            'Your current song code:',
            songCode,
          ])
        } else {
          setOutput((prev) => [...prev, 'No song code entered yet. Use "paste" to input your code.'])
        }
        break
      case 'clear':
        setOutput([])
        setSongCode('')
        break
      case 'vinyl':
        setOutput((prev) => [
          ...prev,
          'Displaying vinyl image:',
          '  _____________',
          ' /             \\',
          '/               \\',
          '|      ___      |',
          '|     /   \\     |',
          '|    |     |    |',
          '|     \\___/     |',
          '\\               /',
          ' \\_____________/',
        ])
        break
      default:
        if (songCode === '' && cmd.trim() !== '') {
          setSongCode((prev) => prev + cmd + '\n')
        } else {
          setOutput((prev) => [...prev, `Unknown command: ${cmd}`])
        }
    }
  }

  const submitToGoogleSheets = async (code: string) => {
    // Replace 'YOUR_GOOGLE_FORM_URL' with your actual Google Form submission URL
    const formUrl = 'YOUR_GOOGLE_FORM_URL'

    try {
      const response = await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'entry.XXXXXX': code, // Replace XXXXXX with your form field ID
        }),
      })

      setOutput((prev) => [...prev, 'Song code submitted successfully to Google Sheets!'])
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error)
      setOutput((prev) => [...prev, 'Error submitting song code. Please try again.'])
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-4">
          <Terminal className="mr-2" />
          <h1 className="text-2xl font-bold">VinylCode CLI</h1>
        </div>
        <div className="bg-black p-4 rounded-lg h-[70vh] overflow-y-auto">
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div className="flex items-center">
            <span className="mr-2">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInput}
              className="bg-transparent outline-none flex-grow"
              aria-label="Command input"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
