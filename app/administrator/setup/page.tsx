"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, FileText, Database, Lock, ExternalLink } from "lucide-react"

interface SetupStep {
  id: number
  title: string
  description: string
  status: "completed" | "pending" | "warning"
  details: string[]
  docs?: string
}

export default function AdminSetupPage() {
  const [steps] = useState<SetupStep[]>([
    {
      id: 1,
      title: "Environment Variables",
      description: "Configure required environment variables",
      status: "completed",
      details: [
        "ADMIN_EMAIL - Admin login email",
        "ADMIN_PASSWORD - Admin password",
        "ADMIN_SECRET_KEY - API authentication key",
        "JWT_SECRET - JWT token secret",
        "EMAIL_USER - SMTP email address",
        "EMAIL_PASS - SMTP app password",
        "NEXT_PUBLIC_BASE_URL - Website URL",
      ],
      docs: "/DETAILS.md",
    },
    {
      id: 2,
      title: "Email Configuration",
      description: "Setup SMTP for sending emails",
      status: "completed",
      details: [
        "Configure Gmail/Outlook SMTP settings",
        "Generate app-specific password",
        "Test email delivery with OTP",
        "Enable SMTP in email provider",
      ],
    },
    {
      id: 3,
      title: "Data Directory",
      description: "Initialize JSON data files",
      status: "completed",
      details: [
        "Create /data directory (auto-created on first run)",
        "submissions-data.json - RSVP and wishes storage",
        "photos.json - Guest photo metadata",
        "All files initialized on first API call",
      ],
    },
    {
      id: 4,
      title: "Vercel Blob Setup (Optional)",
      description: "Configure cloud storage for production",
      status: "pending",
      details: [
        "Add Vercel Blob integration to project",
        "Get VERCEL_BLOB_TOKEN",
        "Update image upload API to use Blob",
        "Migrate existing data if needed",
      ],
    },
    {
      id: 5,
      title: "Analytics Tracking",
      description: "Enable page view and event tracking",
      status: "pending",
      details: [
        "Tracking automatically records all API calls",
        "View analytics dashboard at /administrator/analytics",
        "Real-time metrics updating every 30 seconds",
        "Requires admin authentication",
      ],
    },
    {
      id: 6,
      title: "Security Audit",
      description: "Review security settings",
      status: "pending",
      details: [
        "Admin session timeout set to 60 minutes",
        "JWT tokens validated on all admin endpoints",
        "OTP verified before login",
        "CSRF protection enabled",
        "Input validation on all forms",
      ],
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div>
            <h1 className="text-3xl font-medium tracking-widest uppercase mb-2">Admin Setup Guide</h1>
            <p className="text-sm font-mono tracking-wider text-muted-foreground">
              Complete checklist for wedding website administration
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <Link href="/DETAILS.md" className="inline-flex items-center gap-2 text-sm font-mono tracking-wider mb-4">
            <FileText className="w-4 h-4" />
            <span className="hover:underline">View Full Technical Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid gap-6">
          {steps.map((step) => (
            <Card key={step.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium tracking-widest uppercase">
                        Step {step.id}: {step.title}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs tracking-wider mt-1">
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono tracking-wider px-2 py-1 border ${
                      step.status === "completed"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : step.status === "warning"
                          ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                          : "border-gray-300 bg-gray-50 text-gray-700"
                    }`}
                  >
                    {step.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-mono">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span className="text-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2 mt-8 bg-blue-50 border-blue-300">
          <CardHeader>
            <CardTitle className="text-base font-medium tracking-widest uppercase flex items-center gap-2">
              <Info className="w-5 h-5" />
              Key Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm font-mono">
              <p className="font-medium mb-2">Admin Login Portal:</p>
              <p className="text-muted-foreground">
                <Link href="/administrator/login" className="text-blue-600 hover:underline">
                  /administrator/login
                </Link>
              </p>
            </div>
            <div className="text-sm font-mono">
              <p className="font-medium mb-2">Admin Dashboard:</p>
              <p className="text-muted-foreground">
                <Link href="/administrator" className="text-blue-600 hover:underline">
                  /administrator
                </Link>
              </p>
            </div>
            <div className="text-sm font-mono">
              <p className="font-medium mb-2">Analytics Dashboard:</p>
              <p className="text-muted-foreground">
                <Link href="/administrator/analytics" className="text-blue-600 hover:underline">
                  /administrator/analytics
                </Link>
              </p>
            </div>
            <div className="text-sm font-mono">
              <p className="font-medium mb-2">Data Storage Locations:</p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• /data/submissions-data.json (RSVPs & Wishes)</li>
                <li>• /data/photos.json (Guest Photos Metadata)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium tracking-widest uppercase">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-mono">
              <p>
                <strong>RSVP Data:</strong> Automatically saved to submissions-data.json when guests RSVP
              </p>
              <p>
                <strong>Photo Data:</strong> Guest uploaded photo metadata stored in photos.json, requires admin
                approval
              </p>
              <p>
                <strong>Backup:</strong> Regularly backup the /data directory for safety
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium tracking-widest uppercase">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-mono">
              <p>
                <strong>Admin Token:</strong> JWT tokens valid for 1 hour, stored in sessionStorage
              </p>
              <p>
                <strong>OTP:</strong> One-time passwords valid for 10 minutes, sent via email
              </p>
              <p>
                <strong>API Key:</strong> Use ADMIN_SECRET_KEY for backend API authentication
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 border-2 border-gray-200 bg-gray-50">
          <h3 className="text-sm font-mono tracking-widest uppercase font-medium mb-3">Quick Start</h3>
          <ol className="space-y-2 text-sm font-mono list-decimal list-inside">
            <li>Set all environment variables in .env.local</li>
            <li>Test email configuration by going to /administrator/login</li>
            <li>Create admin account with OTP verification</li>
            <li>Access admin dashboard to monitor RSVPs and wishes</li>
            <li>Review guest photo uploads and approve/reject</li>
            <li>Monitor analytics in real-time dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

import { Info } from "lucide-react"
