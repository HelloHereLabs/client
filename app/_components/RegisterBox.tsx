'use client'

import { OnboardingBox } from '@/components/common/onboarding/OnboardingBox'
import axiosInstance from '@/lib/axiosInstance'
import queryClient from '@/lib/reactQueryClient'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import T from '@mui/material/Typography'
import { QueryClientProvider, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// 인증 상태 확인하는 훅 (httpOnly 쿠키 대응)
const useAuthToken = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 인증이 필요한 API 엔드포인트로 확인 (예: /api/auth/me)
        const response = await axiosInstance.get('/api/auth/me', {
          withCredentials: true, // 쿠키 포함
        })
        setHasToken(true)
        console.log('✅ Authenticated user found:', response.data)
      } catch {
        setHasToken(false)
        console.log('❌ No valid authentication found')
      }
    }

    checkAuthStatus()
  }, [])

  return hasToken
}

export type UserData = {
  language: string
  interests: string[]
  purpose: string
}

// API 응답 타입 정의
export type Location = {
  latitude: number
  longitude: number
}

export type User = {
  userId: string
  language: string
  interests: string[]
  purpose: string
  location: Location
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export type AuthStartResponse = {
  message: string
  user: User
  expiresAt: number
}

type StartBoxProps = {
  setter: () => void
}

type LanguageBoxProps = {
  setter: () => void
  onLanguageSelect: (language: string) => void
}

type InterestsBoxProps = {
  setter: () => void
  onInterestsSelect: (interests: string[]) => void
}

type PurposeBoxProps = {
  setter: () => void
  onPurposeSelect: (purpose: string) => void
  userData: UserData | null
}

const StartBox = ({ setter }: StartBoxProps) => {
  const startMutation = useMutation<AuthStartResponse>({
    mutationFn: async (): Promise<AuthStartResponse> => {
      const { data } =
        await axiosInstance.post<AuthStartResponse>('/api/auth/start')
      if (data) {
        localStorage.setItem('user-id', data.user.userId)
      }
      return data
    },
    onSuccess: (data: AuthStartResponse) => {
      console.log('Start success:', data.message)
      setter()
    },
    onError: (error) => {
      alert(error)
    },
  })

  const handleStart = () => {
    startMutation.mutate()
  }

  return (
    <Box className="w-full h-full flex flex-col justify-end items-center">
      <Button
        variant="contained"
        color="primary"
        onClick={handleStart}
        disabled={startMutation.isPending}
        className="w-[90%] h-13 bg-hh-primary/80 mb-10"
      >
        {startMutation.isPending ? 'Loading...' : 'Get Started'}
      </Button>
    </Box>
  )
}

const LANGUAGES = [
  'English',
  'Korean',
  'Japanese',
  'Chinese',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Russian',
  'Portuguese',
  'Arabic',
  'Hindi',
  'Vietnamese',
  'Thai',
  'Indonesian',
  'Turkish',
]

const LanguageBox = ({ setter, onLanguageSelect }: LanguageBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [filteredLanguages, setFilteredLanguages] = useState(LANGUAGES)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const filtered = LANGUAGES.filter((lang) =>
        lang.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredLanguages(filtered)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language)
    onLanguageSelect(language)
  }

  const handleNext = () => {
    if (selectedLanguage) {
      setter()
    }
  }

  return (
    <Box className="w-full h-full bg-hh-color4/60 rounded-3xl flex flex-col justify-between items-center">
      <T className="font-bold text-lg italic p-5">Choice your language</T>

      <Box className="w-full px-6">
        <TextField
          placeholder="Search language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-hh-color4/90 rounded-lg"
          size="small"
        />
      </Box>

      <Box className="w-full flex-1 px-6 py-3 overflow-y-auto">
        {filteredLanguages.map((language) => (
          <Box
            key={language}
            onClick={() => handleLanguageSelect(language)}
            className={`p-3 mb-2 rounded-lg cursor-pointer bg-hh-color4 text-hh-primary border-2 box-border ${
              selectedLanguage === language
                ? 'border-hh-primary shadow-inner'
                : 'border-transparent'
            }`}
          >
            <T className="font-bold italic">{language}</T>
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        disabled={!selectedLanguage}
        className="w-[90%] h-13 bg-hh-primary/80 mb-10"
      >
        Next
      </Button>
    </Box>
  )
}

const INTERESTS = [
  'K-POP',
  'K-DRAMA',
  'K-FOOD',
  'HISTORY',
  'HANBOK',
  'TAEKWONDO',
  'K-BEAUTY',
  'LANGUAGE',
]
const InterestsBox = ({ setter, onInterestsSelect }: InterestsBoxProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const handleInterestSelect = (interest: string) => {
    const newSelectedInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest]

    setSelectedInterests(newSelectedInterests)
    onInterestsSelect(newSelectedInterests)
  }

  const handleNext = () => {
    if (selectedInterests.length > 0) {
      setter()
    }
  }

  return (
    <Box className="w-full h-full bg-hh-color4/60 rounded-3xl flex flex-col justify-between items-center">
      <T className="font-bold text-lg italic p-5">Select Your Interests</T>
      <Box className="interestBox w-full flex-1 grid grid-cols-2 gap-3 p-6 pt-0">
        {INTERESTS.map((interest, idx) => {
          const colorClass = [0, 3, 4, 7].includes(idx % 8)
            ? 'text-hh-primary'
            : 'text-hh-secondary'
          const isSelected = selectedInterests.includes(interest)
          return (
            <Box
              key={interest}
              onClick={() => handleInterestSelect(interest)}
              className={`${colorClass} interestBoxItem rounded-xl flex items-center justify-center bg-hh-color4 cursor-pointer border-2 box-border ${
                isSelected
                  ? 'border-hh-primary shadow-inner'
                  : 'border-transparent'
              }`}
            >
              <T className="font-bold italic">{interest}</T>
            </Box>
          )
        })}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        disabled={selectedInterests.length === 0}
        className="w-[90%] h-13 bg-hh-primary/80 mb-10"
      >
        Next
      </Button>
    </Box>
  )
}

const PURPOSES = [
  'Language Exchange',
  'Travel Companion',
  'Professional Networking',
  'Cultural Learning',
  'Friendship',
  'Study Partner',
  'Business Collaboration',
  'Hobby Sharing',
]

const PurposeBox = ({ setter, onPurposeSelect, userData }: PurposeBoxProps) => {
  const [selectedPurpose, setSelectedPurpose] = useState('')

  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose)
    onPurposeSelect(purpose)
  }

  const handleNext = () => {
    if (selectedPurpose) {
      patchUserDataMutation.mutate({
        ...userData,
        purpose: selectedPurpose,
      } as UserData)
      setter()
    }
  }

  const patchUserDataMutation = useMutation({
    mutationFn: async (userData: UserData) => {
      const userId = localStorage.getItem('user-id')
      const { data } = await axiosInstance.patch(
        `/api/users/${userId}`,
        userData,
        {
          withCredentials: false,
        },
      )
      return data
    },
    onSuccess: (data) => {
      console.log('User data saved:', data)
    },
    onError: (error) => {
      console.error('Error saving user data:', error)
    },
  })

  return (
    <Box className="w-full h-full bg-hh-color4/60 rounded-3xl flex flex-col justify-between items-center">
      <T className="font-bold text-lg italic p-5">Select Your Purpose</T>

      <Box className="w-full flex-1 px-6 py-3 overflow-y-auto">
        <Box className="grid grid-cols-2 gap-3">
          {PURPOSES.map((purpose, idx) => {
            const colorClass = [0, 3, 4, 7].includes(idx % 8)
              ? 'text-hh-primary'
              : 'text-hh-secondary'
            const isSelected = selectedPurpose === purpose
            return (
              <Box
                key={purpose}
                onClick={() => handlePurposeSelect(purpose)}
                className={`${colorClass} purposeBoxItem rounded-xl flex items-center justify-center bg-hh-color4 cursor-pointer border-2 box-border min-h-16 p-3 ${
                  isSelected
                    ? 'border-hh-primary shadow-inner'
                    : 'border-transparent'
                }`}
              >
                <T className="font-bold italic text-center">{purpose}</T>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        disabled={!selectedPurpose}
        className="w-[90%] h-13 bg-hh-primary/80 mb-10"
      >
        Next
      </Button>
    </Box>
  )
}

const FADE_DURATION = 300

const RegisterContainer = () => {
  const router = useRouter()
  const hasToken = useAuthToken()
  const [step, setStep] = useState('start')
  const [fade, setFade] = useState<'in' | 'out'>('in')
  const [userData, setUserData] = useState<UserData>({
    language: '',
    interests: [],
    purpose: '',
  })

  // 토큰이 있는 경우 온보딩으로 바로 이동
  useEffect(() => {
    if (hasToken === true) {
      console.log('✅ Token found, skipping registration')
      setStep('complete')
    } else if (hasToken === false) {
      console.log('❌ No token found, starting registration')
    }
  }, [hasToken])

  // 토큰 확인 중일 때 로딩 표시
  if (hasToken === null) {
    return (
      <QueryClientProvider client={queryClient}>
        <Box className="h-[72%] w-[90%] mt-6 rounded-3xl p-3 flex items-center justify-center">
          <T className="text-hh-primary italic">Checking authentication...</T>
        </Box>
      </QueryClientProvider>
    )
  }

  const handleNext = (target: string) => {
    setFade('out')
    setTimeout(() => {
      setStep(target)
      setFade('in')
    }, FADE_DURATION)
  }

  const handleLanguageSelect = (language: string) => {
    setUserData((prev) => ({ ...prev, language }))
  }

  const handleInterestsSelect = (interests: string[]) => {
    setUserData((prev) => ({ ...prev, interests }))
  }

  const handlePurposeSelect = (purpose: string) => {
    setUserData((prev) => ({ ...prev, purpose }))
  }

  const handleEnd = () => {
    console.log('Onboarding complete. User data:', userData)
    router.replace('/find')
  }

  let content
  switch (step) {
    case 'start':
      content = <StartBox setter={() => handleNext('language')} />
      break
    case 'language':
      content = (
        <LanguageBox
          setter={() => handleNext('interests')}
          onLanguageSelect={handleLanguageSelect}
        />
      )
      break
    case 'interests':
      content = (
        <InterestsBox
          setter={() => handleNext('purpose')}
          onInterestsSelect={handleInterestsSelect}
        />
      )
      break
    case 'purpose':
      content = (
        <PurposeBox
          setter={() => handleNext('complete')}
          onPurposeSelect={handlePurposeSelect}
          userData={userData}
        />
      )
      break
    case 'complete':
      content = (
        // 온보딩 가이드 시작
        <OnboardingBox handleEnd={handleEnd} />
      )
      break
    default:
      content = <StartBox setter={() => handleNext('language')} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        className={`h-[72%] w-[90%] mt-6 rounded-3xl p-3 transition-opacity duration-300 ${fade === 'in' ? 'opacity-100' : 'opacity-0'}`}
      >
        {content}
      </Box>
    </QueryClientProvider>
  )
}

export default RegisterContainer
