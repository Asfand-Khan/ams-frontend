"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, easeOut } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  },
};

const titleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    }
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-md mx-4 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <CardTitle className="text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                404
              </CardTitle>
            </motion.div>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 dark:text-gray-400">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <motion.div variants={buttonVariants} whileHover="hover" className="max-w-max mx-auto">
              <Button asChild className="group transition-colors duration-200" size="lg">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}