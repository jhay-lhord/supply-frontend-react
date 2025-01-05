import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PDFGeneratorDialog from "../../shared/components/PDFGenerator";

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

export const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPDFGeneratorOpen, setIsPDFGeneratorOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen(!isOpen)

  const pdfButtons = [
    { label: "PDF Generator", onClick: () => setIsPDFGeneratorOpen(true) },
    {
      label: "Track Purchase Request",
      onClick: () => console.log("PR PDF clicked"),
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mb-4 flex w-full flex-col gap-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {pdfButtons.map((button, index) => (
                <motion.div
                  key={button.label}
                  variants={buttonVariants}
                  custom={index}
                >
                  <Button
                    onClick={button.onClick}
                    className="w-full rounded-full bg-orange-200 text-black hover:bg-orange-300"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {button.label}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="self-end"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={toggleOpen}
            className="group flex h-16 w-16 items-center justify-center rounded-full bg-orange-200 text-black shadow-lg transition-colors hover:bg-orange-300"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="sr-only">Quick Access</span>
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>
      <PDFGeneratorDialog isOpen={isPDFGeneratorOpen} setIsOpen={setIsPDFGeneratorOpen}/>
    </>
  );
};
