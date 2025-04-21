"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Package,
  BarChart3,
  Users,
  Clock,
  Shield,
  Database,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import Header from "@/components/layout/Header";
import { useAuth } from "@/providers/auth-provider";

export default function Homepage() {
  const { handleLogin, isAuthenticated, isLoading } = useAuth();
  const handleClickScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <Header>
          <nav className="hidden md:flex items-center gap-6">
            <div
              onClick={() => handleClickScroll("features")}
              className="text-sm cursor-pointer font-medium hover:text-primary transition-colors"
            >
              Features
            </div>
            {/* <div onClick={() => handleClickScroll('pricing')} className="text-sm cursor-pointer font-medium hover:text-primary transition-colors">Pricing</div> */}
          </nav>
        </Header>

        <main className="flex-1 w-full">
          {/* Hero Section */}
          <section className="py-20 md:py-28 w-full">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <Badge className="inline-block" variant="outline">
                      The complete solution for dental labs
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      Streamline Your Dental Lab Management
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                      The comprehensive platform that helps dental labs manage
                      cases, doctors, materials, and inventory with precision and
                      ease.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    {!isLoading && isAuthenticated ?
                      <Button size="lg" asChild>
                        <Link href={"/dashboard"}>Go to Dashboard</Link>
                      </Button>
                      : <>
                        <Button onClick={() => handleLogin()} size="lg" className="gap-1.5 group">
                          Start Free Trial
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button size="lg" variant="outline">
                          Book a Demo
                        </Button>
                      </>
                    }
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-primary" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-primary" />
                      <span>14-day free trial</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full aspect-video overflow-hidden rounded-xl border bg-gradient-to-b from-background/10 to-background/50 p-1 shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-80" />
                    {/* <Image
                    src="https://picsum.photos/600/400"
                    alt="Dashboard Preview"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover border shadow-md"
                    unoptimized
                  /> */}

                    <div className="absolute bottom-4 right-4">
                      <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-background/70"
                      >
                        Live Preview
                      </Badge>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Replacing Clients/Partners Section */}
          <section className="border-y bg-muted/40 py-12 w-full">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-xl font-medium tracking-tight text-muted-foreground">
                    Seamless Integrations & Technology
                  </h2>
                </div>
                <div className="grid grid-cols-2 min-[540px]:grid-cols-4 items-center justify-center gap-8 md:gap-12 lg:gap-16">
                  {[
                    {
                      name: "Cloud Sync",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 0 1 4-4h10a4 4 0 1 1 0 8H7a4 4 0 0 1-4-4z"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "Data Security",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c1.104 0 2-.896 2-2V6c0-1.104-.896-2-2-2s-2 .896-2 2v3c0 1.104.896 2 2 2zm0 4v3m0-7h.01"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "Customizable",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "24/7 Support",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-2.21 0-4 1.79-4 4 0 .617.154 1.197.424 1.714L10 16h4l1.576-2.286A3.982 3.982 0 0 0 16 12c0-2.21-1.79-4-4-4z"
                          />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center justify-center"
                    >
                      {item.icon}
                      <span className="mt-2 font-semibold">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 md:py-28 w-full">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <Badge className="inline-block" variant="secondary">
                    Features
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Everything you need to manage your dental lab
                  </h2>
                  <p className="max-w-[900px] mx-auto text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                    Our platform combines powerful features with an intuitive
                    interface to help you streamline operations and focus on what
                    matters most.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <Users className="h-10 w-10 text-primary" />,
                    title: "Doctor Management",
                    description:
                      "Keep track of all your doctors and their preferences, ensuring personalized service every time.",
                  },
                  {
                    icon: <Database className="h-10 w-10 text-primary" />,
                    title: "Case Tracking",
                    description:
                      "Monitor each case from receipt to delivery with detailed status updates and notifications.",
                  },
                  {
                    icon: <Package className="h-10 w-10 text-primary" />,
                    title: "Inventory Control",
                    description:
                      "Maintain optimal stock levels with automated alerts and reordering based on your usage patterns.",
                  },
                  {
                    icon: <BarChart3 className="h-10 w-10 text-primary" />,
                    title: "Analytics Dashboard",
                    description:
                      "Gain insights with comprehensive reporting on productivity, revenue, and business growth.",
                  },
                  {
                    icon: <Clock className="h-10 w-10 text-primary" />,
                    title: "Real-time Updates",
                    description:
                      "Access the latest information across all devices with our cloud-based synchronization.",
                  },
                  {
                    icon: <Shield className="h-10 w-10 text-primary" />,
                    title: "Secure Data Storage",
                    description:
                      "Rest easy knowing your sensitive data is protected with enterprise-grade security protocols.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="relative overflow-hidden border-none bg-background shadow-md transition-all hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
                      <CardHeader>
                        <div className="mb-3">{feature.icon}</div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section className="py-20 bg-muted/30 w-full">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <Badge className="inline-block" variant="outline">
                    Workflow
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    How Dental Data Works
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                    Our intuitive platform makes managing your dental lab simple
                    and efficient
                  </p>
                </div>
              </div>
              <div className="mt-16 grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Register cases",
                    description:
                      "Quickly log new cases with our streamlined intake form designed specifically for dental labs.",
                  },
                  {
                    step: "02",
                    title: "Track progress",
                    description:
                      "Monitor every step of production with real-time updates and automated notifications.",
                  },
                  {
                    step: "03",
                    title: "Deliver with confidence",
                    description:
                      "Complete quality checks, generate delivery notes, and manage billing all in one place.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 relative z-10">
                      <span className="text-lg font-bold">{item.step}</span>
                    </div>
                    {index < 2 && (
                      <div className="absolute top-6 left-[calc(50%+34px)] w-[calc(100%-36px)] border-t border-dashed border-muted-foreground/30 hidden md:block" />
                    )}
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          {/* <section id="pricing" className="py-20 md:py-28 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block" variant="secondary">
                  Pricing
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that&apos;s right for your dental lab
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {[
                      {
                        title: "Starter",
                        price: "$99",
                        description: "Perfect for small dental labs just getting started",
                        features: [
                          "Up to 2 users",
                          "100 cases per month",
                          "Basic reporting",
                          "Doctor management",
                          "Email support"
                        ],
                        cta: "Get Started",
                        popular: false
                      },
                      {
                        title: "Professional",
                        price: "$249",
                        description: "Ideal for growing dental laboratories",
                        features: [
                          "Up to 10 users",
                          "Unlimited cases",
                          "Advanced analytics",
                          "Inventory management",
                          "Priority support",
                          "API access"
                        ],
                        cta: "Get Started",
                        popular: true
                      },
                      {
                        title: "Enterprise",
                        price: "$499",
                        description: "For large labs with complex requirements",
                        features: [
                          "Unlimited users",
                          "Unlimited cases",
                          "Custom reporting",
                          "Dedicated account manager",
                          "24/7 phone support",
                          "Custom integrations",
                          "Training sessions"
                        ],
                        cta: "Contact Sales",
                        popular: false
                      }
                    ].map((plan, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className={`flex flex-col relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                          {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                              <Badge variant="default" className="px-6 py-1 text-sm">Most Popular</Badge>
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle>{plan.title}</CardTitle>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">{plan.price}</span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                  <Check className="mr-2 h-4 w-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                              {plan.cta}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annually">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {[
                      {
                        title: "Starter",
                        price: "$79",
                        description: "Perfect for small dental labs just getting started",
                        features: [
                          "Up to 2 users",
                          "100 cases per month",
                          "Basic reporting",
                          "Doctor management",
                          "Email support"
                        ],
                        cta: "Get Started",
                        popular: false
                      },
                      {
                        title: "Professional",
                        price: "$199",
                        description: "Ideal for growing dental laboratories",
                        features: [
                          "Up to 10 users",
                          "Unlimited cases",
                          "Advanced analytics",
                          "Inventory management",
                          "Priority support",
                          "API access"
                        ],
                        cta: "Get Started",
                        popular: true
                      },
                      {
                        title: "Enterprise",
                        price: "$399",
                        description: "For large labs with complex requirements",
                        features: [
                          "Unlimited users",
                          "Unlimited cases",
                          "Custom reporting",
                          "Dedicated account manager",
                          "24/7 phone support",
                          "Custom integrations",
                          "Training sessions"
                        ],
                        cta: "Contact Sales",
                        popular: false
                      }
                    ].map((plan, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className={`flex flex-col relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                          {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                              <Badge variant="default" className="px-6 py-1 text-sm">Most Popular</Badge>
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle>{plan.title}</CardTitle>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">{plan.price}</span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                  <Check className="mr-2 h-4 w-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                              {plan.cta}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section> */}

          {/* FAQ Section */}
          {/* <section id="faq" className="py-20 md:py-28 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block" variant="secondary">
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Frequently asked questions
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Everything you need to know about our dental lab management solution
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How easy is it to migrate from our current system?",
                    answer: "We've designed our migration process to be as smooth as possible. Our team will work with you to import your existing data, and we provide comprehensive training to ensure your team is comfortable with the new system. Most labs are up and running within a few days."
                  },
                  {
                    question: "Can Dental Data integrate with our accounting software?",
                    answer: "Yes, Dental Data integrates with popular accounting software including QuickBooks, Xero, and Sage. We also offer an API for custom integrations with other systems you may be using."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Absolutely. We implement bank-level encryption, regular security audits, and strict access controls. Our platform is HIPAA compliant, ensuring all patient and doctor information is protected to the highest standards."
                  },
                  {
                    question: "What kind of support do you offer?",
                    answer: "All plans include email support with a 24-hour response time. Professional and Enterprise plans include priority support with faster response times, and Enterprise customers receive dedicated account management and 24/7 phone support."
                  },
                  {
                    question: "Can I customize the system to match our workflow?",
                    answer: "Yes, Dental Data is highly customizable. You can configure case workflows, create custom fields, set up automation rules, and design reports that match your specific needs. Enterprise customers also receive custom development services."
                  },
                  {
                    question: "Do you offer a free trial?",
                    answer: "Yes, we offer a 14-day free trial with no credit card required. You'll get full access to all features so you can thoroughly evaluate if Dental Data is right for your lab."
                  }
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="overflow-hidden">
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AnimatePresence>
                      <AccordionContent>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-muted-foreground pt-2">{faq.answer}</p>
                        </motion.div>
                      </AccordionContent>
                    </AnimatePresence>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section> */}

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground py-16 md:py-24 w-full flex items-center justify-center">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Ready to transform your dental lab?
                  </h2>
                  <p className="max-w-[700px] md:text-xl/relaxed mx-auto">
                    Join hundreds of dental labs already using Dental Data to
                    streamline their operations
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {!isLoading && isAuthenticated ?
                    <Button className="to-secondary hover:from-secondary/80 hover:to-secondary/80" variant={"secondary"} size="lg" asChild>
                      <Link href={"/dashboard"}>Go to Dashboard</Link>
                    </Button>
                    :
                    <>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="gap-1.5 group to-secondary hover:from-secondary/80 hover:to-secondary/80"
                        onClick={() => handleLogin()}
                      >
                        Start Your Free Trial
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20"
                      >
                        Schedule a Demo
                      </Button>
                    </>
                  }
                </div>
                <p className="text-sm text-primary-foreground/80">
                  No credit card required. 14-day free trial.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t py-12 md:py-16 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Logo src="/old-fav.ico" className="size-16" />
                  <span className="text-xl font-bold">Dental Data</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comprehensive dental lab management software designed by lab
                  professionals, for lab professionals.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li
                    onClick={() => handleClickScroll("features")}
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  >
                    Features
                  </li>
                  {/* <li onClick={() => handleClickScroll('pricing')} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Pricing</li> */}
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Case Studies
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2025 Dental Data. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
