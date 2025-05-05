"use client";

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
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function PricingSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the perfect plan for your dental practice. No hidden fees, cancel anytime.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="h-full"
            >
              <Card
                className={`border h-full flex flex-col overflow-hidden transition-all duration-200 ${
                  plan.popular
                    ? "border-primary shadow-md ring-1 ring-primary/20 scale-105"
                    : "hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-medium text-center py-1">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold capitalize flex items-center justify-between">
                    {plan.name}
                    {plan.price === 0 ? (
                      <Badge variant="secondary" className="ml-2">
                        Free
                      </Badge>
                    ) : (
                      <span className="text-sm font-normal text-muted-foreground">
                        ${plan.price}/month
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="size-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 pb-4 mt-auto">
                  <Link href="/signup" className="w-full">
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      size="default"
                      className="w-full"
                    >
                      {plan.price === 0 ? "Get Started" : "Start 14-day trial"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-4">
            <Button variant="link" asChild>
              <Link href="/pricing">
                View full pricing details
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}