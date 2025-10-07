export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-slate max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using {process.env.NEXT_PUBLIC_COMPANY_NAME}, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-muted-foreground mb-4">
            Permission is granted to temporarily download one copy of the materials on {process.env.NEXT_PUBLIC_COMPANY_NAME} for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-muted-foreground mb-4">
            The materials on {process.env.NEXT_PUBLIC_COMPANY_NAME} are provided on an 'as is' basis. {process.env.NEXT_PUBLIC_COMPANY_NAME} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-muted-foreground mb-4">
            In no event shall {process.env.NEXT_PUBLIC_COMPANY_NAME} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {process.env.NEXT_PUBLIC_COMPANY_NAME}.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Privacy Policy</h2>
          <p className="text-muted-foreground mb-4">
            Your Privacy Policy is incorporated into this Agreement by reference. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Revisions and Errata</h2>
          <p className="text-muted-foreground mb-4">
            The materials appearing on {process.env.NEXT_PUBLIC_COMPANY_NAME} could include technical, typographical, or photographic errors. {process.env.NEXT_PUBLIC_COMPANY_NAME} does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
          <p className="text-muted-foreground mb-4">
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </p>
        </section>
      </div>
    </div>
  );
}