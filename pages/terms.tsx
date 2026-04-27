import { Card } from "@/components/ui/card"

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-medium tracking-widest uppercase mb-4">Terms of Service</h1>
        <p className="text-sm font-mono tracking-wider text-gray-600">Last updated: December 2024</p>
      </div>

      <div className="space-y-8">
        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">1. Acceptance of Terms</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            By accessing and using this wedding website, you accept and agree to be bound by the terms and provision of
            this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">2. Use License</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed mb-3">
            Permission is granted to temporarily download one copy of the materials (information or software) on our
            website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
            of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm font-mono tracking-wider text-gray-700">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">3. Disclaimer</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            The materials on our website are provided without any conditions or warranties, either express or implied.
            We make no warranties, explicit or implied, that the materials are accurate, complete, or that your use of
            the website will be uninterrupted or error-free.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">4. Photo Upload Rights</h2>
          <div className="space-y-3 text-sm font-mono tracking-wider text-gray-700">
            <p>
              <span className="font-medium">Your Responsibility:</span> You are solely responsible for any photos you
              upload to our guest gallery. You warrant that you own or have the right to use all photos you upload.
            </p>
            <p>
              <span className="font-medium">Prohibited Content:</span> You may not upload photos that are offensive,
              explicit, defamatory, or infringing on anyone's intellectual property rights.
            </p>
            <p>
              <span className="font-medium">Content Moderation:</span> We reserve the right to remove any content that
              violates these terms or our community standards.
            </p>
          </div>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">5. Limitations of Liability</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            In no event shall our organization or its suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
            inability to use the materials on our website, even if we or an authorized representative has been notified
            orally or in writing of the possibility of such damage.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">6. Accuracy of Materials</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            The materials appearing on our website could include technical, typographical, or photographic errors. We do
            not warrant that any of the materials on our website are accurate, complete, or current. We may make changes
            to the materials contained on our website at any time without notice.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">7. Links to Third-Party Websites</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any
            linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked
            website is at the user's own risk.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">8. Modifications</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            We may revise these terms of service for our website at any time without notice. By using this website, you
            are agreeing to be bound by the then current version of these terms of service.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">9. Governing Law</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you
            irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-3">10. Contact Information</h2>
          <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at:
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
