import { Card } from "@/components/ui/card"

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-medium tracking-widest uppercase mb-4">Privacy Policy</h1>
        <p className="text-sm font-mono tracking-wider text-gray-600">Last updated: December 2024</p>
      </div>

      <div className="space-y-8">
        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">1. Introduction</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you
            visit our wedding website. We are committed to protecting your privacy and ensuring transparency about how
            your data is used.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">2. Information We Collect</h2>
          <div className="space-y-3 text-sm font-mono tracking-wider text-gray-700">
            <p>
              <span className="font-medium">Personal Information:</span> Name, email address, phone number, and RSVP
              status when you submit our RSVP form.
            </p>
            <p>
              <span className="font-medium">Photo Information:</span> When uploading photos, we collect your name,
              email, and the photo URL along with metadata about the event.
            </p>
            <p>
              <span className="font-medium">Analytics Data:</span> We automatically collect information about your
              interaction with our website, including IP address, browser type, pages visited, and time spent on pages.
            </p>
            <p>
              <span className="font-medium">Cookies:</span> We use cookies to enhance your browsing experience and
              remember your preferences.
            </p>
          </div>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">3. How We Use Your Information</h2>
          <div className="space-y-3 text-sm font-mono tracking-wider text-gray-700">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Process your RSVP and send you wedding updates</li>
              <li>Display your photos in our guest gallery</li>
              <li>Send you wedding day reminders and important information</li>
              <li>Analyze website usage and improve user experience</li>
              <li>Respond to your inquiries and requests</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">4. Photo Usage Rights</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed mb-3">
            By uploading photos to our guest gallery, you grant us permission to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm font-mono tracking-wider text-gray-700">
            <li>Display your photos on our wedding website</li>
            <li>Store your photos for archival purposes</li>
            <li>Use your photos in wedding memories and compilations (with your name credited)</li>
          </ul>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed mt-3">
            You retain all copyrights to your photos. If you wish to have your photos removed, contact us at
            ayopet4real@gmail.com.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">5. Data Security</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            We implement reasonable security measures to protect your personal information from unauthorized access,
            alteration, or destruction. However, no method of transmission over the Internet is 100% secure. We cannot
            guarantee absolute security of your data.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">6. Third-Party Services</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            Our website uses third-party services for analytics and data storage. These services have their own privacy
            policies. We do not control how these third parties use your information. Please review their privacy
            policies for more information.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">7. Your Rights</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm font-mono tracking-wider text-gray-700">
            <li>Request access to your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">8. Contact Us</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p className="text-sm font-mono tracking-wider text-gray-700 mt-3">
            Email: ayopet4real@gmail.com
            <br />
            Phone: +2348167788117
          </p>
        </Card>
      </div>
    </div>
  )
}
