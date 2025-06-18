"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  Users,
  Zap,
  ArrowRight,
  MessageSquare,
  Send,
  Menu,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils" // Assuming cn is in lib/utils.ts

// --- START: StandaloneIntakeForm Code ---
const contractIntakeSchema = z.object({
  projectDescription: z.string().min(10, "Please describe your project in more detail"),
  userRole: z.enum(["client", "freelancer"], {
    required_error: "Please select your role in this project",
  }),
  userEmail: z.string().email("Please enter a valid email address"),
  userName: z.string().min(2, "Please enter your name"),
  otherPartyEmail: z.string().email("Please enter the other party's email"),
  otherPartyName: z.string().optional(),
  personalMessage: z.string().optional(),
})

type ContractIntakeFormValues = z.infer<typeof contractIntakeSchema>

function LocalStandaloneIntakeForm({ onBack }: { onBack: () => void }) {
  const [detectedTemplate, setDetectedTemplate] = useState<"freelancer" | "agency" | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<ContractIntakeFormValues>({
    resolver: zodResolver(contractIntakeSchema),
    defaultValues: {
      projectDescription: "",
      userRole: undefined,
      userEmail: "",
      userName: "",
      otherPartyEmail: "",
      otherPartyName: "",
      personalMessage: "",
    },
  })

  const analyzeProject = async (description: string) => {
    if (description.length < 10) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const freelancerKeywords = ["logo", "design", "website", "freelancer", "individual", "personal"]
    const agencyKeywords = ["agency", "team", "company", "marketing", "campaign", "brand strategy"]
    const hasFreelancerKeywords = freelancerKeywords.some((keyword) => description.toLowerCase().includes(keyword))
    const hasAgencyKeywords = agencyKeywords.some((keyword) => description.toLowerCase().includes(keyword))

    if (hasAgencyKeywords && !hasFreelancerKeywords) {
      setDetectedTemplate("agency")
      setAiAnalysis("This looks like an agency services project - multiple team members, strategic work.")
    } else {
      setDetectedTemplate("freelancer")
      setAiAnalysis("This appears to be individual freelancer work - perfect for our Freelancer Services Agreement.")
    }
  }

  const handleProjectDescriptionChange = (value: string) => {
    form.setValue("projectDescription", value)
    if (value.length > 20) {
      analyzeProject(value)
    } else {
      setDetectedTemplate(null)
      setAiAnalysis("")
    }
  }

  const handleSubmit = async (data: ContractIntakeFormValues) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setShowSuccess(true)
    console.log("Form submitted:", { ...data, detectedTemplate: detectedTemplate || "freelancer" })
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          ← Back to Demo
        </Button>
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 Negotiation Room Created!</CardTitle>
            <CardDescription className="text-green-700">
              Your AI-assisted contract negotiation room is ready. Both parties will receive invitations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">Next Steps:</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Email invitations sent to both parties</li>
                  <li>• Room available for 30 days</li>
                  <li>• AI mediator and personal lawyers ready</li>
                  <li>• Most negotiations complete in 20-30 minutes</li>
                </ul>
              </div>
              <Button onClick={() => setShowSuccess(false)} className="w-full">
                Create Another Contract
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Demo
      </Button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Your First Contract</h1>
        <p className="text-lg text-gray-600">
          Describe your project and we'll set up your AI-assisted negotiation room
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✓ Your first contract is free
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ✓ No lawyers needed
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            ✓ Fair terms for everyone
          </Badge>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" /> Project Details
          </CardTitle>
          <CardDescription>Tell us about your project and we'll prepare the perfect negotiation room</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Describe your project</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I need a logo designed for my startup restaurant..."
                        className="min-h-[100px] resize-none"
                        {...field}
                        onChange={(e) => handleProjectDescriptionChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>Be specific - our AI will use this to prepare the negotiation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {aiAnalysis && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">AI Analysis</p>
                      <p className="text-sm text-blue-800">{aiAnalysis}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          {detectedTemplate === "freelancer" ? "Freelancer Agreement" : "Agency Agreement"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="userRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">What's your role?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-4">
                        <FormItem className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="client" id="client" />
                          </FormControl>
                          <FormLabel htmlFor="client" className="flex-1 cursor-pointer">
                            <div className="font-medium">I'm hiring</div>
                            <div className="text-sm text-gray-500">I need services delivered</div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="freelancer" id="freelancer" />
                          </FormControl>
                          <FormLabel htmlFor="freelancer" className="flex-1 cursor-pointer">
                            <div className="font-medium">I'm providing services</div>
                            <div className="text-sm text-gray-500">I'm the freelancer/agency</div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>Your name</FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userEmail"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>Your email</FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
              </div>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Invite the other party
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="otherPartyEmail"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Their email</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="sarah@example.com" type="email" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherPartyName"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Their name (optional)</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="Sarah Johnson" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="personalMessage"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      {" "}
                      <FormLabel>Personal message (optional)</FormLabel>{" "}
                      <FormControl>
                        <Textarea
                          placeholder="Hi Sarah! Let's negotiate..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>{" "}
                      <FormDescription>Included in the invitation email</FormDescription> <FormMessage />{" "}
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-6">
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating room...
                    </>
                  ) : (
                    <>
                      Create Negotiation Room <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">Both parties will receive an invitation</p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
// --- END: StandaloneIntakeForm Code ---

// --- START: StandaloneNegotiationRoom Code ---
interface NegotiationMessage {
  id: string
  sender: "user" | "other_party" | "ai_mediator" | "ai_lawyer_user" | "ai_lawyer_other"
  content: string
  timestamp: Date
  sectionId?: string
}

interface ContractSection {
  id: string
  title: string
  status: "pending" | "discussing" | "agreed" | "conflicted"
  order: number
}

const mockContractSections: ContractSection[] = [
  { id: "1", title: "What We Are Creating", status: "discussing", order: 1 },
  { id: "2", title: "Our Project Timeline", status: "pending", order: 2 },
  { id: "3", title: "Investment & Returns", status: "pending", order: 3 },
  // Add more sections as needed for demo
]

function LocalStandaloneNegotiationRoom({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<NegotiationMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [mobileView, setMobileView] = useState<"chat" | "contract">("chat")
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUser = { id: "user1", name: "John Smith", role: "client" as const }
  const otherParty = { id: "user2", name: "Sarah Johnson", role: "freelancer" as const }

  useEffect(() => {
    const welcomeMessages: NegotiationMessage[] = [
      {
        id: "1",
        sender: "ai_mediator",
        content: `Welcome! ${currentUser.name} and ${otherParty.name}, let's start with the project scope.`,
        timestamp: new Date(),
      },
      {
        id: "2",
        sender: "ai_lawyer_user",
        content: `Hi ${currentUser.name}! I'm your AI lawyer.`,
        timestamp: new Date(),
      },
      { id: "3", sender: "other_party", content: "Hi John! Excited to start.", timestamp: new Date() },
    ]
    setMessages(welcomeMessages)
  }, [])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(scrollToBottom, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    const message: NegotiationMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
      sectionId: mockContractSections[currentSectionIndex]?.id,
    }
    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setTimeout(() => {
      const aiResponse: NegotiationMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai_mediator",
        content: "Interesting point. Let's explore that.",
        timestamp: new Date(),
        sectionId: mockContractSections[currentSectionIndex]?.id,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const getSenderInfo = (sender: NegotiationMessage["sender"]) => {
    switch (sender) {
      case "user":
        return { name: currentUser.name, color: "bg-blue-100", textColor: "text-blue-800", icon: null }
      case "other_party":
        return { name: otherParty.name, color: "bg-green-100", textColor: "text-green-800", icon: null }
      case "ai_mediator":
        return { name: "AI Mediator", color: "bg-purple-100", textColor: "text-purple-800", icon: null }
      case "ai_lawyer_user":
        return { name: "Your AI Lawyer", color: "bg-blue-100", textColor: "text-blue-800", icon: null }
      case "ai_lawyer_other":
        return {
          name: `${otherParty.name}'s AI Lawyer`,
          color: "bg-green-100",
          textColor: "text-green-800",
          icon: null,
        }
      default:
        return { name: "Unknown", color: "bg-gray-100", textColor: "text-gray-800", icon: null }
    }
  }

  const currentSection = mockContractSections[currentSectionIndex]

  const ViewModeToggle = () => (
    <div className="flex items-center gap-2 mb-4">
      <Button variant={viewMode === "desktop" ? "default" : "outline"} size="sm" onClick={() => setViewMode("desktop")}>
        {" "}
        <Monitor className="w-4 h-4 mr-2" /> Desktop{" "}
      </Button>
      <Button variant={viewMode === "mobile" ? "default" : "outline"} size="sm" onClick={() => setViewMode("mobile")}>
        {" "}
        <Smartphone className="w-4 h-4 mr-2" /> Mobile{" "}
      </Button>
    </div>
  )

  if (viewMode === "mobile") {
    return (
      <div className="max-w-sm mx-auto border rounded-lg overflow-hidden">
        <Button variant="outline" onClick={onBack} className="m-4">
          ← Back to Demo
        </Button>
        <ViewModeToggle />
        <div className="h-[600px] flex flex-col bg-gray-50">
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentSection?.title || "Loading..."}</Badge>
                <span className="text-sm text-gray-500">
                  {currentSectionIndex + 1} of {mockContractSections.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileView(mobileView === "chat" ? "contract" : "chat")}
              >
                {mobileView === "chat" ? <FileText className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="bg-white border-b">
            <div className="flex">
              <Button
                variant={mobileView === "chat" ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setMobileView("chat")}
              >
                {" "}
                <MessageSquare className="w-4 h-4 mr-2" /> Chat{" "}
              </Button>
              <Button
                variant={mobileView === "contract" ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setMobileView("contract")}
              >
                {" "}
                <FileText className="w-4 h-4 mr-2" /> Contract{" "}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {mobileView === "chat" ? (
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const senderInfo = getSenderInfo(message.sender)
                      return (
                        <div key={message.id} className="flex items-start gap-3">
                          <div
                            className={cn("w-8 h-8 rounded-full flex items-center justify-center", senderInfo.color)}
                          >
                            {senderInfo.icon || (
                              <span className="text-xs font-medium">{senderInfo.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn("text-xs font-medium", senderInfo.textColor)}>{senderInfo.name}</span>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 break-words">{message.content}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <div className="p-4 bg-white border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      {" "}
                      <Send className="w-4 h-4" />{" "}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{currentSection?.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">Contract section details for mobile...</p>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                        disabled={currentSectionIndex === 0}
                      >
                        {" "}
                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev{" "}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentSectionIndex(Math.min(mockContractSections.length - 1, currentSectionIndex + 1))
                        }
                        disabled={currentSectionIndex === mockContractSections.length - 1}
                      >
                        {" "}
                        Next <ChevronRight className="w-4 h-4 ml-1" />{" "}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto border rounded-lg overflow-hidden">
      <Button variant="outline" onClick={onBack} className="m-4">
        ← Back to Demo
      </Button>
      <ViewModeToggle />
      <div className="h-[700px] flex bg-gray-50">
        <div
          className={cn(
            "bg-white border-r transition-all duration-300",
            leftPanelOpen ? "w-80" : "w-0 overflow-hidden",
          )}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Contract Sections</h2>
            <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(false)}>
              {" "}
              <X className="w-4 h-4" />{" "}
            </Button>
          </div>
          <ScrollArea className="h-[calc(700px-80px)]">
            <div className="p-4 space-y-2">
              {mockContractSections.map((section, index) => (
                <div
                  key={section.id}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer",
                    index === currentSectionIndex ? "bg-blue-100" : "hover:bg-gray-50",
                  )}
                  onClick={() => setCurrentSectionIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{section.title}</span>
                    <Badge variant={section.status === "agreed" ? "default" : "secondary"} className="text-xs">
                      {section.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!leftPanelOpen && (
                <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(true)}>
                  {" "}
                  <Menu className="w-4 h-4" />{" "}
                </Button>
              )}
              <div>
                <h1 className="font-semibold">Negotiation Room</h1>
                <p className="text-sm text-gray-500">
                  Section {currentSectionIndex + 1}: {currentSection?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Monitor className="w-4 h-4 text-gray-400" /> <span className="text-sm text-gray-500">
                Desktop Mode
              </span>{" "}
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => {
                const senderInfo = getSenderInfo(message.sender)
                return (
                  <div key={message.id} className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", senderInfo.color)}>
                      {senderInfo.icon || <span className="text-sm font-medium">{senderInfo.name.charAt(0)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-sm font-medium", senderInfo.textColor)}>{senderInfo.name}</span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border">
                        <p className="text-sm text-gray-900">{message.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="bg-white border-t p-4">
            <div className="max-w-4xl mx-auto flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Discuss this section..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                {" "}
                <Send className="w-4 h-4 mr-2" /> Send{" "}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-80 bg-white border-l">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Participants
            </h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              {" "}
              <Avatar>
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>{" "}
              <div className="flex-1">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
              </div>{" "}
              <Badge variant="secondary">You</Badge>{" "}
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              {" "}
              <Avatar>
                <AvatarFallback>{otherParty.name.charAt(0)}</AvatarFallback>
              </Avatar>{" "}
              <div className="flex-1">
                <p className="font-medium">{otherParty.name}</p>
                <p className="text-sm text-gray-500 capitalize">{otherParty.role}</p>
              </div>{" "}
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />{" "}
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">AI Assistants</h3>
              {[
                { name: "AI Mediator", icon: null, color: "bg-purple-100", desc: "Guides negotiation" },
                { name: "Your AI Lawyer", icon: null, color: "bg-blue-100", desc: "Protects your interests" },
                {
                  name: `${otherParty.name}'s AI Lawyer`,
                  icon: null,
                  color: "bg-green-100",
                  desc: "Protects their interests",
                },
              ].map((ai) => (
                <div key={ai.name} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", ai.color)}>{ai.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ai.name}</p>
                    <p className="text-xs text-gray-500">{ai.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// --- END: StandaloneNegotiationRoom Code ---

// --- START: Main Demo Component ---
type ViewMode = "landing" | "intake" | "negotiation"

export default function ContractPlatformDemo() {
  const [currentView, setCurrentView] = useState<ViewMode>("landing")

  const handleBackToDemo = () => setCurrentView("landing")

  if (currentView === "intake") {
    return <LocalStandaloneIntakeForm onBack={handleBackToDemo} />
  }

  if (currentView === "negotiation") {
    return <LocalStandaloneNegotiationRoom onBack={handleBackToDemo} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agreemint</h1>
          <p className="text-xl text-gray-600 mb-6">AI-assisted contract negotiation platform</p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🤝 AI-mediated negotiation
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              ⚖️ Personal AI lawyers
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              ✍️ Sign in one session
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("intake")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Smart Intake Form
              </CardTitle>
              <CardDescription>AI-powered contract creation that detects the right template.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside mb-4">
                <li>AI template detection</li>
                <li>Smart project analysis</li>
                <li>Automated invitation system</li>
              </ul>
              <Button className="w-full">
                Try Intake Form <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setCurrentView("negotiation")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Negotiation Room
              </CardTitle>
              <CardDescription>Real-time AI-assisted negotiation with mobile-responsive design.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside mb-4">
                <li>Desktop & mobile views</li>
                <li>AI mediator & lawyers</li>
                <li>Section-by-section flow</li>
              </ul>
              <Button className="w-full">
                Enter Negotiation Room <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-white/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: "📝", title: "Describe Project", desc: "AI analyzes needs & selects template." },
                { icon: "🤝", title: "Enter Room", desc: "Both parties join AI-assisted room." },
                { icon: "💬", title: "Negotiate", desc: "AI guides, lawyers protect interests." },
                { icon: "✍️", title: "Sign", desc: "Digital signatures complete contract." },
              ].map((step) => (
                <div key={step.title} className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <h3 className="font-medium mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to experience the future of contract negotiation?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setCurrentView("intake")}>
              Start Your First Contract
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCurrentView("negotiation")}>
              See Negotiation Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
// --- END: Main Demo Component ---
