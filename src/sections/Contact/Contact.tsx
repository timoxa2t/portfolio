"use client";

import { FC } from "react";
import {
  Box,
  Typography,
  Grid,
  // TextField,
  // Button,
  // Card,
  // CardContent,
  // Alert,
  // CircularProgress,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import s from "./Contact.module.scss";

const email = "alextymoshov@gmail.com";
const phone = "+38 (093) 937-80-37";

export const Contact: FC = () => {
  const t = useTranslations("contact");
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   message: "",
  // });

  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitStatus, setSubmitStatus] = useState<{
  //   type: "success" | "error" | null;
  //   message: string;
  // }>({ type: null, message: "" });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setSubmitStatus({ type: null, message: "" });

  //   try {
  //     const response = await fetch("/api/contact", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setSubmitStatus({
  //         type: "success",
  //         message: t("form.success", {
  //           default: "Message sent successfully! I'll get back to you soon.",
  //         }),
  //       });
  //       setFormData({ name: "", email: "", message: "" });
  //     } else {
  //       setSubmitStatus({
  //         type: "error",
  //         message:
  //           data.error ||
  //           t("form.error", {
  //             default: "Failed to send message. Please try again.",
  //           }),
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Contact form error:", error);
  //     setSubmitStatus({
  //       type: "error",
  //       message: t("form.error", {
  //         default: "Failed to send message. Please try again.",
  //       }),
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <section className={s.contact} id="contact">
      <Box className={"container"}>
        <Box className={s.content}>
          <Typography variant="h2" className={s.title}>
            {t("title", { default: "Get In Touch" })}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className={s.contactInfo}>
                <Typography variant="h4" className={s.infoTitle}>
                  {t("info.title", { default: "Contact Information" })}
                </Typography>
                <Box className={s.infoItems}>
                  <Box className={s.infoItem}>
                    <Email className={s.icon} />
                    <Typography variant="body1">{email}</Typography>
                  </Box>
                  <Box className={s.infoItem}>
                    <Phone className={s.icon} />
                    <Typography variant="body1">{phone}</Typography>
                  </Box>
                  <Box className={s.infoItem}>
                    <LocationOn className={s.icon} />
                    <Typography variant="body1">
                      {t("info.location", { default: "Kyiv, Ukraine" })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <Card className={s.formCard}>
                <CardContent>
                  {submitStatus.type && (
                    <Alert
                      severity={submitStatus.type}
                      sx={{ mb: 2 }}
                      onClose={() =>
                        setSubmitStatus({ type: null, message: "" })
                      }
                    >
                      {submitStatus.message}
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit} className={s.form}>
                    <TextField
                      fullWidth
                      name="name"
                      label={t("form.name", { default: "Your Name" })}
                      value={formData.name}
                      onChange={handleChange}
                      className={s.formField}
                      required
                    />
                    <TextField
                      fullWidth
                      name="email"
                      label={t("form.email", { default: "Your Email" })}
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={s.formField}
                      required
                    />
                    <TextField
                      fullWidth
                      name="message"
                      label={t("form.message", { default: "Your Message" })}
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={s.formField}
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      className={s.submitButton}
                      disabled={isSubmitting}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {isSubmitting
                        ? t("form.sending", { default: "Sending..." })
                        : t("form.submit", { default: "Send Message" })}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
    </section>
  );
};
