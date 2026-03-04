import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Trade Cosmo Objekts
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Post what you have and what you want. Find collectors with matching
          trades. Complete the trade in the Cosmo app.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button size="lg" asChild>
            <Link href="/trades">Browse Trades</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold">Link your Cosmo</h3>
            <p className="text-sm text-muted-foreground">
              Verify your Cosmo account by setting a code in your status message.
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold">Post a trade</h3>
            <p className="text-sm text-muted-foreground">
              Select objekts you have and objekts you want from your inventory.
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold">Find a match</h3>
            <p className="text-sm text-muted-foreground">
              We find people who have what you want and want what you have.
              Trade in the Cosmo app!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
