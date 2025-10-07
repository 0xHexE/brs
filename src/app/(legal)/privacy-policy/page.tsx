export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            At {process.env.NEXT_PUBLIC_COMPANY_NAME}, we collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form.
          </p>
          <p className="text-muted-foreground mb-4">
            When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number or credit card information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            Any of the information we collect from you may be used in one of the following ways:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4">
            <li>To personalize your experience</li>
            <li>To improve our website</li>
            <li>To improve customer service</li>
            <li>To process transactions</li>
            <li>To send periodic emails</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
          <p className="text-muted-foreground mb-4">
            We use cookies to enhance your experience on our website. By continuing to use our site, you agree to our use of cookies in accordance with our Cookie Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Disclosure</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except for the following circumstances:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4">
            <li>When required by law</li>
            <li>To protect and defend our rights or property</li>
            <li>To prevent or investigate possible wrongdoing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground mb-4">
            You have the right to access, update, or delete your personal information at any time. You can do this by logging into your account settings or contacting us directly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If there are any questions regarding this privacy policy, you may contact us using the information below:
          </p>
          <p className="text-muted-foreground">
            {process.env.NEXT_PUBLIC_COMPANY_NAME}<br />
            Email: privacy@{process.env.NEXT_PUBLIC_COMPANY_NAME?.toLowerCase().replace(/\s+/g, '')}.com
          </p>
        </section>
      </div>
    </div>
  );
}