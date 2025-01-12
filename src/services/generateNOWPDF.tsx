import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { digitsToWords } from "../utils/digitsToWords";
import { supplierItemType_ } from "@/types/response/abstract-of-quotation";
import { formatDate } from "@/utils/formatDateInBAC";

// Register a fallback font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Create styles with the registered font
const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 20,
    fontSize: 12,
    fontFamily: "Roboto",
    margin: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
    marginTop: -110,
  },
  headerLogo: {
    width: 100,
    height: 100,
  },
  headerCenter: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  header: {
    fontSize: 14,
    margin: 0,
    padding: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: -5,
    marginBottom: -5,
    padding: 0,
  },
  headerAddress: {
    fontSize: 10,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerContact: {
    fontSize: 9,
  },
  bagongPilipinasLogo: {
    width: 100,
    height: 100,
  },
  mainContent: {
    flex: 1,
    marginVertical: -10,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -10,
    marginBottom: 10,
  },
  title_big: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    marginBottom: 10,
    lineHeight: 1.5,
  },
  boldText: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  recipient: {
    fontWeight: "bold",
  },
  signature: {
    marginTop: 30,
  },
  signatureLine: {
    width: "60%",
    borderBottom: "1px solid black",
    marginTop: 40,
    marginBottom: 5,
    marginLeft: "auto",
    marginRight: "auto",
  },
  signatureText: {
    marginLeft: 8,
    width: "50%",
  },
  signatureTextCenter: {
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerImage: {
    height: 30,
    width: "100%",
    marginHorizontal: 5,
  },
}) satisfies Record<string, Style>;


export const generateNOAPDF = (data: supplierItemType_) => {
  const now = new Date()

  return (
    <Document>
      <Page size={[8.5 * 72, 13 * 72]} style={styles.page}>
        {/* Header */}
        <Image src="/header.jpeg" />
        <View style={styles.headerContainer}>
          <View style={styles.headerCenter}>
            <Text style={styles.header}>Republic of the Philippines</Text>
            <Text style={styles.headerTitle}>
              CEBU TECHNOLOGICAL UNIVERSITY
            </Text>
            <Text style={styles.headerSubtitle}>ARGAO CAMPUS</Text>
            <Text style={styles.headerAddress}>
              Ed Kintanar Street, Lamacan, Argao Cebu Philippines
            </Text>
            <Text style={styles.headerContact}>
              Website: <Text style={{textDecoration: 'underline', color: 'blue'}}>http://www.argao.ctu.edu.ph</Text> E-mail: cdargao@ctu.edu.ph
            </Text>
            <Text style={styles.headerContact}>
              Phone No.: (032) 4858-290/4855-109 loc 1700 Fax. NO.:
              (032)4858-290
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Bids and Awards Committee</Text>
          <Text style={styles.title_big}>NOTICE OF AWARD</Text>

          <View style={{ marginBottom: 24 }}>
            <Text>{formatDate(now)}</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={styles.recipient}>{data.rfq_details.supplier_name}</Text>
            <Text>{data.rfq_details.supplier_address}</Text>
            {/* {recipient.address.map((line, i) => (
              <Text key={i}>{line}</Text>
            ))} */}
          </View>

          <Text style={{ marginBottom: 40 }}>Dear Sir/Madam:</Text>

          <View style={styles.content}>
            <Text style={{ lineHeight: 0 }}>
              We are pleased to notify you that the{" "}
              <Text style={styles.boldText}>{data.supplier_details.aoq_details.pr_details.office}</Text>{" "}
              request, in connection with the{" "}
              <Text style={styles.boldText}>{formatDate(data.supplier_details.aoq_details.pr_details.created_at)}</Text>, is
              hereby awarded{" "}
              <Text style={styles.boldText}>{data.rfq_details.supplier_name}</Text> being the
              sole bidder with the Lowest Calculated & Responsive Bid at a
              contract price equivalent to{" "}
              <Text style={styles.boldText}>
                {digitsToWords(Number(data.item_cost)).toUpperCase()} (PHP
                {data.item_cost}.00)
              </Text>
              .
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={{ lineHeight: 0 }}>
              You are therefore required within ten (10) days upon receipt this
              Notice of Award, to formally enter into contract with us. Failure
              to enter into the said contract shall constitute sufficient ground
              for cancellation of this award.
            </Text>
          </View>

          <Text style={{ marginTop: 40 }}>Very truly yours,</Text>

          <View style={styles.signature}>
            <View style={styles.signatureText}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                {data.supplier_details.aoq_details.pr_details.campus_director_details.name}
              </Text>
              <Text style={{ fontSize: 10, textAlign: "center" }}>
                {data.supplier_details.aoq_details.pr_details.campus_director_details.designation}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 60 }}>
            <Text style={{ marginLeft: 15 }}>Conforme:</Text>
            <View style={styles.signatureLine} />
            <View style={styles.signatureTextCenter}>
              <Text>(Signature over Printed Name)</Text>
              <Text style={{ fontWeight: "bold" }}>{data.rfq_details.supplier_name}</Text>
              <Text>Date: _________________</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
            <Image
              src={`/footer.jpeg`}
              style={styles.footerImage}
            />
        </View>
      </Page>
    </Document>
  );
};
