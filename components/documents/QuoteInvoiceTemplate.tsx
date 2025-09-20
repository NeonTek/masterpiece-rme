import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

Font.register({
  family: "Roboto",
  fonts: [
    { src: `${baseUrl}/fonts/Roboto-Regular.ttf`, fontWeight: "normal" },
    { src: `${baseUrl}/fonts/Roboto-Bold.ttf`, fontWeight: "bold" },
  ],
});

// --- A more detailed StyleSheet to match the mockups ---
const styles = StyleSheet.create({
  page: { fontFamily: "Roboto", fontSize: 10, padding: 30, color: "#333" },
  header: { textAlign: "center", marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 9, color: "#555" },
  section: { marginBottom: 15 },
  sectionHeader: {
    backgroundColor: "#E5E7EB",
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11,
    marginBottom: 8,
  },
  customerInfo: {
    borderTop: 1,
    borderBottom: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 15,
  },
  customerText: { marginBottom: 2 },
  boldText: { fontWeight: "bold" },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableColHeader: {
    backgroundColor: "#F3F4F6",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    fontWeight: "bold",
  },
  tableCol: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableCell: { fontSize: 9 },
  tableCellHeader: { fontSize: 9, fontWeight: "bold" },
  textRight: { textAlign: "right" },
  footerSection: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    marginTop: 20,
    fontSize: 9,
  },
  terms: { marginTop: 20, fontSize: 8, color: "#555" },
});

interface LineItem {
  name: string;
  quantity: number;
  price: number;
}
interface TemplateData {
  customer: { name: string; email: string; phone: string };
  items: LineItem[];
  letterhead: string | null;
}

export const QuoteInvoicePDF = ({ data }: { data: TemplateData }) => {
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const invoiceCode = `MMM${Date.now().toString().slice(-6)}INV`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.letterhead && (
          <Image
            src={data.letterhead}
            // alt prop removed; not supported by @react-pdf/renderer
            style={{ width: "100%", height: "auto", marginBottom: 20 }}
          />
        )}

        {!data.letterhead && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>MASTERPIECE EMPIRE</Text>
            <Text style={styles.headerSubtitle}>
              Nairobi, Kenya | +254 706 030912
            </Text>
          </View>
        )}

        <View style={styles.customerInfo}>
          <Text style={styles.customerText}>
            <Text style={styles.boldText}>CUSTOMER NAME:</Text>{" "}
            {data.customer.name}
          </Text>
          <Text style={styles.customerText}>
            <Text style={styles.boldText}>Email:</Text> {data.customer.email}{" "}
            <Text style={styles.boldText}> Phone Nos:</Text>{" "}
            {data.customer.phone}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text>INVOICE CODE : {invoiceCode}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "45%" }}>
              <Text style={styles.tableCellHeader}>ITEM</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "15%" }}>
              <Text style={styles.tableCellHeader}>QUANTITY</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: "20%",
                ...styles.textRight,
              }}
            >
              <Text style={styles.tableCellHeader}>EACH</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: "20%",
                ...styles.textRight,
              }}
            >
              <Text style={styles.tableCellHeader}>TOTAL</Text>
            </View>
          </View>
          {data.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={{ ...styles.tableCol, width: "45%" }}>
                <Text style={styles.tableCell}>{item.name}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "15%" }}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "20%",
                  ...styles.textRight,
                }}
              >
                <Text style={styles.tableCell}>{item.price.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "20%",
                  ...styles.textRight,
                }}
              >
                <Text style={styles.tableCell}>
                  {(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ ...styles.tableRow }}>
            <View
              style={{ ...styles.tableCol, width: "80%", ...styles.textRight }}
            >
              <Text style={styles.boldText}>TOTAL</Text>
            </View>
            <View
              style={{ ...styles.tableCol, width: "20%", ...styles.textRight }}
            >
              <Text style={styles.boldText}>{totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.boldText}>PAYMENT DETAILS</Text>
          <Text>
            PAY TO TILL: buy goods Till no. 4189906 (Masterpiece Empire)
          </Text>
          <Text>
            PAY TO BANK: StanBic Bank, Kenyatta Avenue, A/C 0100010297553
          </Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.boldText}>TERMS:</Text>
          <Text>
            This Quotation is valid for utmost 7days after date of issue.
          </Text>
          <Text>VAT is applied where/when Applicable</Text>
          <Text>
            Make payments to either of the two Options mentioned above ONLY.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
