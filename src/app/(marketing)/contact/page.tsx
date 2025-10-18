/**
 * Contact Page
 * Contact form and information
 */

'use client'

import * as React from 'react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Linkedin, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              Let's Start a Conversation
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Schedule a free 30-minute funding feasibility review to explore opportunities, 
              timeline, and approach for your project.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {!submitted ? (
                <Card>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input 
                          label="First Name" 
                          name="firstName" 
                          required 
                          disabled={isSubmitting}
                        />
                        <Input 
                          label="Last Name" 
                          name="lastName" 
                          required 
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <Input 
                        label="Email" 
                        name="email" 
                        type="email" 
                        required 
                        disabled={isSubmitting}
                      />
                      
                      <Input 
                        label="Organization" 
                        name="organization" 
                        required 
                        disabled={isSubmitting}
                      />
                      
                      <Textarea 
                        label="Project Description" 
                        name="description" 
                        placeholder="Tell us about your planning needs, timeline, and any specific challenges..."
                        rows={6}
                        required 
                        disabled={isSubmitting}
                      />
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Request Information'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-[#1F4E2E] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-700 mb-6">
                      We'll review your request and get back to you within 1-2 business days.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#1F4E2E] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Sierra Foothills</div>
                        <div className="text-sm text-gray-600">Near Grass Valley, CA</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#1F4E2E] flex-shrink-0 mt-0.5" />
                      <div>
                        <a href="mailto:nfredmond@gmail.com" className="text-[#1F4E2E] hover:underline">
                          nfredmond@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Linkedin className="w-5 h-5 text-[#1F4E2E] flex-shrink-0 mt-0.5" />
                      <div>
                        <a 
                          href="https://linkedin.com/in/nfredmond" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#1F4E2E] hover:underline"
                        >
                          linkedin.com/in/nfredmond
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Response Time</h3>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#1F4E2E] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      We typically respond to inquiries within 1-2 business days. 
                      For urgent matters, please email directly.
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1F4E2E] text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Free Consultation</h3>
                  <p className="text-sm text-gray-200">
                    Every new project starts with a free 30-minute funding feasibility review 
                    to explore grant opportunities and project approach.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

