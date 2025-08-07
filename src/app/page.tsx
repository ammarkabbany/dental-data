"use client";
import React, { useRef } from "react"; // Added useRef
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion"; // Added useScroll, useTransform
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import Header from "@/components/layout/Header";
import { useAuth } from "@/providers/auth-provider";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plans } from "@/lib/constants";
import { formatCurrency, getYearlyPrice } from "@/lib/format-utils";
import MainFooter from "@/components/layout/Footer";
import { VideoShowcaseSection } from "@/components/video-showcase";

export default function Homepage() {
  const { handleLogin, isAuthenticated, isLoading } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null); // Added ref for hero section
  const { scrollYProgress } = useScroll({ // Added scrollYProgress
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax for h1: slower scroll up
  const h1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  // Parallax for p: slightly faster scroll up
  const pY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);


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
          <nav className="hidden text-sm font-medium lg:text-base lg:font-semibold md:flex items-center gap-6 lg:gap-8">
            <div
              onClick={() => handleClickScroll("features")}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              Features
            </div>
            <div
              onClick={() => handleClickScroll("workflow")}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              Workflow
            </div>
            <div
              onClick={() => handleClickScroll("showcase")}
              className="cursor-pointer text-purple-400 hover:text-purple-500 transition-colors"
            >
              Showcase
            </div>
            <div onClick={() => handleClickScroll('pricing')} className="cursor-pointer hover:text-primary transition-colors">Pricing</div>
          </nav>
        </Header>

        <main className="flex-1 w-full">
          {/* Hero Section */}
          <section ref={heroRef} className="w-full py-24 md:py-32 lg:py-40 bg-background text-foreground relative overflow-hidden"> {/* Added ref and overflow-hidden */}
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-1 text-sm font-medium border-primary/50 text-primary dark:text-primary-foreground bg-primary/10 dark:bg-primary/20"
                  >
                    The complete solution for dental labs
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                  style={{ y: h1Y }} // Added parallax style
                  className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none"
                >
                  Streamline Your Dental Lab Management
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  style={{ y: pY }} // Added parallax style
                  className="max-w-[700px] text-lg text-gray-600 md:text-xl dark:text-gray-300 font-light"
                >
                  The comprehensive platform that helps dental labs manage
                  cases, doctors, materials, and inventory with precision and
                  ease.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  className="flex flex-col gap-4 min-[400px]:flex-row justify-center items-center" // items-center for motion.div alignment
                >
                  {!isLoading && isAuthenticated ? (
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground">
                        <Link href={"/dashboard"}>Go to Dashboard</Link>
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                        <Button
                          onClick={() => handleLogin("/onboarding")}
                          size="lg"
                          className="gap-1.5 group bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground"
                        >
                          Start Free Trial
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                        <Button size="lg" variant="outline" className="border-foreground/30 hover:bg-foreground/5 dark:border-foreground/30 dark:hover:bg-foreground/5">
                          Book a Demo
                        </Button>
                      </motion.div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-primary" />
                    <span>14-day free trial</span>
                  </div>
                </motion.div>
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
          <section id="features" className="w-full py-24 md:py-32 lg:py-40 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12 md:mb-16">
                <Badge
                  variant="outline"
                  className="px-4 py-1 text-sm font-medium border-primary/50 text-primary dark:text-primary-foreground bg-primary/10 dark:bg-primary/20"
                >
                  Features
                </Badge>
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Everything you need to manage your dental lab
                </h2>
                <p className="max-w-[900px] mx-auto text-lg text-gray-600 md:text-xl dark:text-gray-300 font-light">
                  Our platform combines powerful features with an intuitive
                  interface to help you streamline operations and focus on what
                  matters most.
                </p>
              </div>
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <Users className="h-10 w-10 text-primary" />,
                    title: "Doctor Management",
                    description:
                      "Easily manage your doctors and their cases with our intuitive dashboard.",
                  },
                  {
                    icon: <Database className="h-10 w-10 text-primary" />,
                    title: "Case Management",
                    description:
                      "Easily create, and manage cases from start to finish with our intuitive dashboard.",
                  },
                  {
                    icon: <Check className="h-10 w-10 text-primary" />,
                    title: "Automated Notifications",
                    description:
                      "Stay updated with automated notifications for case status changes and updates.",
                  },
                  {
                    icon: <BarChart3 className="h-10 w-10 text-primary" />,
                    title: "Analytics Dashboard",
                    description:
                      "Gain insights into your lab's performance with our analytics dashboard.",
                  },
                  {
                    icon: <Clock className="h-10 w-10 text-primary" />,
                    title: "Real-time Updates",
                    description:
                      "Recieve real-time updates from your team, ensuring everyone is on the same page.",
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
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03 }}
                    className="h-full" // Ensure motion.div takes full height for consistent card heights if content varies
                  >
                    <Card className="h-full flex flex-col relative overflow-hidden bg-muted/20 dark:bg-neutral-800/30 shadow-lg dark:shadow-neutral-700/50 transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-neutral-600/60 border border-transparent hover:border-primary/30 dark:hover:border-primary/50">
                      {/* Optional: Subtle decorative element
                      <div className="absolute -top-1/3 -right-1/4 w-2/3 h-2/3 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                      */}
                      <CardHeader className="z-10">
                        <div className="mb-4 text-primary dark:text-primary-foreground/80">{React.cloneElement(feature.icon, { className: "h-10 w-10" })}</div>
                        <CardTitle className="text-xl font-semibold text-foreground dark:text-gray-100">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 z-10">
                        <p className="text-muted-foreground dark:text-gray-400 text-sm">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Video Showcase Section */}
          <VideoShowcaseSection />

          {/* How it Works Section */}
          <section id="workflow" className="w-full py-24 md:py-32 lg:py-40 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12 md:mb-16">
                <Badge
                  variant="outline"
                  className="px-4 py-1 text-sm font-medium border-primary/50 text-primary dark:text-primary-foreground bg-primary/10 dark:bg-primary/20"
                >
                  Workflow
                </Badge>
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  How DentaAuto Works
                </h2>
                <p className="max-w-[900px] mx-auto text-lg text-gray-600 md:text-xl dark:text-gray-300 font-light">
                  Our intuitive platform makes managing your dental lab simple
                  and efficient.
                </p>
              </div>
              <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12 lg:gap-16">
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
                    title: "Export reports",
                    description:
                      "Generate detailed reports and statements for your doctors, ensuring invoicing is a breeze.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2, ease: [0.25, 1, 0.5, 1] }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="relative flex flex-col items-center text-center p-6 rounded-lg transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-primary/10"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground mb-6 relative z-10 ring-4 ring-primary/20 dark:ring-primary/30">
                      <span className="text-2xl font-bold">{item.step}</span>
                    </div>
                    {index < 2 && (
                      <div className="absolute top-8 left-[calc(50%+50px)] w-[calc(100%-20px)] md:left-[calc(50%+54px)] md:w-[calc(100%-48px)] border-t-2 border-dashed border-muted-foreground/30 dark:border-muted-foreground/20 hidden md:block" />
                    )}
                    <h3 className="text-2xl font-semibold text-foreground dark:text-gray-100 mb-3">{item.title}</h3>
                    <p className="text-muted-foreground dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="w-full py-24 md:py-32 lg:py-40 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12 md:mb-16">
                <Badge
                  variant="outline"
                  className="px-4 py-1 text-sm font-medium border-primary/50 text-primary dark:text-primary-foreground bg-primary/10 dark:bg-primary/20"
                >
                  Pricing
                </Badge>
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[700px] mx-auto text-lg text-gray-600 md:text-xl dark:text-gray-300 font-light">
                  Choose the plan that&apos;s right for your dental lab. No hidden fees, ever.
                </p>
              </div>
              <div className="mx-auto mt-12 max-w-5xl">
                <Tabs defaultValue="monthly" className="w-full">
                  <div className="flex justify-center mb-10">
                    <TabsList className="bg-muted/30 dark:bg-neutral-800/50 p-1.5 rounded-lg">
                      <TabsTrigger value="monthly" className="px-6 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md transition-all">Monthly</TabsTrigger>
                      <TabsTrigger value="annually" className="px-6 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md transition-all">Annually (Save 25%)</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="monthly">
                    <div className="grid gap-8 lg:grid-cols-3 items-stretch"> {/* items-stretch for consistent card height */}
                      {Plans.map((plan, index) => (
                        <motion.div
                          key={`monthly-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
                          viewport={{ once: true }}
                          whileHover={{ y: plan.popular ? 0 : -5, scale: plan.popular ? 1.0 : 1.02 }}
                          className={`h-full ${plan.popular ? "ring-2 ring-primary dark:ring-primary shadow-primary/20" : "ring-1 ring-border"} rounded-xl transition-all duration-300`}
                        >
                          <Card className={`flex flex-col h-full relative overflow-hidden p-4 rounded-xl transition-all duration-300 ease-in-out
                            ${plan.popular
                              ? "bg-primary/5 dark:bg-primary/10 shadow-2xl dark:shadow-primary/30"
                              : "bg-muted/20 dark:bg-neutral-800/40 hover:shadow-lg dark:hover:shadow-neutral-700/50"}`
                          }>
                            {plan.popular && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                                <Badge variant="default" className="px-5 py-1.5 text-sm font-semibold bg-primary text-primary-foreground shadow-md">Most Popular</Badge>
                              </div>
                            )}
                            <CardHeader> {/* Removed pt-8 */}
                              <CardTitle className="text-2xl font-semibold text-foreground dark:text-gray-100 mb-1">{plan.name}</CardTitle>
                              <div className="flex items-baseline gap-1.5 mb-3">
                                <span className="text-4xl font-extrabold text-foreground dark:text-gray-50">{formatCurrency(plan.price, 'USD', 0)}</span>
                                <span className="text-muted-foreground dark:text-gray-400">/month</span>
                              </div>
                              <CardDescription className="text-sm text-muted-foreground dark:text-gray-400 min-h-[40px]">{plan.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 my-6">
                              <ul className="space-y-3 text-sm">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2.5">
                                    <feature.icon className={`h-5 w-5 ${plan.popular ? 'text-primary dark:text-primary-foreground/90' : 'text-primary'}`} />
                                    <span className="text-muted-foreground dark:text-gray-300">{feature.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                            {/* <CardFooter>
                              <Button className={`w-full mt-auto ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'}`} variant={plan.popular ? "default" : "secondary"} size="lg" disabled>
                                Choose Plan
                              </Button>
                            </CardFooter> */}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="annually">
                    <div className="grid gap-8 lg:grid-cols-3 items-stretch">
                      {Plans.map((plan, index) => (
                        <motion.div
                          key={`annually-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
                          viewport={{ once: true }}
                          whileHover={{ y: plan.popular ? 0 : -5, scale: plan.popular ? 1.0 : 1.02 }}
                          className={`h-full ${plan.popular ? "ring-2 ring-primary dark:ring-primary shadow-primary/20" : "ring-1 ring-border"} rounded-xl transition-all duration-300`}
                        >
                           <Card className={`flex flex-col h-full relative overflow-hidden p-4 rounded-xl transition-all duration-300 ease-in-out
                            ${plan.popular
                              ? "bg-primary/5 dark:bg-primary/10 shadow-2xl dark:shadow-primary/30"
                              : "bg-muted/20 dark:bg-neutral-800/40 hover:shadow-lg dark:hover:shadow-neutral-700/50"}`
                          }>
                            {plan.popular && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 -translate-y-1/2 z-10">
                               <Badge variant="default" className="px-5 py-1.5 text-sm font-semibold bg-primary text-primary-foreground shadow-md">Most Popular</Badge>
                              </div>
                            )}
                            <CardHeader> {/* Removed pt-8 */}
                              <CardTitle className="text-2xl font-semibold text-foreground dark:text-gray-100 mb-1">{plan.name}</CardTitle>
                              <div className="flex items-baseline gap-1.5 mb-3">
                                <span className="text-4xl font-extrabold text-foreground dark:text-gray-50">{formatCurrency(getYearlyPrice(plan.price, 0.25), 'USD', 0)}</span>
                                <span className="text-muted-foreground dark:text-gray-400">/year</span>
                              </div>
                              <CardDescription className="text-sm text-muted-foreground dark:text-gray-400 min-h-[40px]">{plan.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 my-6">
                              <ul className="space-y-3 text-sm">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2.5">
                                    <feature.icon className={`h-5 w-5 ${plan.popular ? 'text-primary dark:text-primary-foreground/90' : 'text-primary'}`} />
                                    <span className="text-muted-foreground dark:text-gray-300">{feature.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                            {/* <CardFooter>
                              <Button className={`w-full mt-auto ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'}`} variant={plan.popular ? "default" : "secondary"} size="lg" disabled>
                                Choose Plan
                              </Button>
                            </CardFooter> */}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>

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
                    question: "Can DentaAuto integrate with our accounting software?",
                    answer: "Yes, DentaAuto integrates with popular accounting software including QuickBooks, Xero, and Sage. We also offer an API for custom integrations with other systems you may be using."
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
                    answer: "Yes, DentaAuto is highly customizable. You can configure case workflows, create custom fields, set up automation rules, and design reports that match your specific needs. Enterprise customers also receive custom development services."
                  },
                  {
                    question: "Do you offer a free trial?",
                    answer: "Yes, we offer a 14-day free trial with no credit card required. You'll get full access to all features so you can thoroughly evaluate if DentaAuto is right for your lab."
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
          <section className="w-full py-24 md:py-32 lg:py-40 bg-neutral-800 text-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Ready to transform your dental lab?
                </h2>
                <p className="max-w-[700px] text-lg text-gray-300 md:text-xl font-light">
                  Join hundreds of dental labs already using DentaAuto to
                  streamline their operations.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  {!isLoading && isAuthenticated ? (
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                      <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href={"/dashboard"}>Go to Dashboard</Link>
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                      <Button
                        onClick={() => handleLogin("/onboarding")}
                        size="lg"
                        className="gap-1.5 group bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Start Your Free Trial
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  No credit card required. 14-day free trial.
                </p>
              </div>
            </div>
          </section>
        </main>
        <MainFooter />
      </div>
    </>
  );
}
