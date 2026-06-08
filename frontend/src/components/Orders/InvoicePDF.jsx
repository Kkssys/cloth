import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const InvoicePDF = ({ order }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generatePDF = async () => {
    const invoiceElement = document.createElement('div');
    invoiceElement.id = 'invoice-content-temp';
    invoiceElement.style.position = 'absolute';
    invoiceElement.style.top = '-9999px';
    invoiceElement.style.left = '-9999px';
    invoiceElement.style.width = '800px';
    invoiceElement.style.backgroundColor = 'white';
    invoiceElement.style.padding = '20px';
    invoiceElement.style.fontFamily = 'Arial, sans-serif';
    
    invoiceElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; width: 100%;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">FashionStore</h1>
          <p style="margin: 5px 0;">123 Fashion Street, Chennai - 600001</p>
          <p style="margin: 5px 0;">Email: support@fashionstore.com | Phone: +91 98765 43210</p>
          <p style="margin: 5px 0;">GST: 33ABCDE1234F1Z5</p>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <h2>TAX INVOICE</h2>
          <p><strong>Invoice No:</strong> INV-${order._id?.slice(-8)}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 48%;">
            <h3 style="background-color: #f3f4f6; padding: 8px; margin: 0;">Billing Details</h3>
            <div style="border: 1px solid #e5e7eb; padding: 10px;">
              <p><strong>${order.shippingAddress?.fullName || ''}</strong></p>
              <p>${order.shippingAddress?.street || ''}</p>
              <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.district || ''}</p>
              <p>${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}</p>
              <p>${order.shippingAddress?.country || ''}</p>
              <p>Phone: ${order.shippingAddress?.phone || ''}</p>
              <p>Email: ${order.user?.email || order.shippingAddress?.email || ''}</p>
            </div>
          </div>
          <div style="width: 48%;">
            <h3 style="background-color: #f3f4f6; padding: 8px; margin: 0;">Shipping Details</h3>
            <div style="border: 1px solid #e5e7eb; padding: 10px;">
              <p><strong>${order.shippingAddress?.fullName || ''}</strong></p>
              <p>${order.shippingAddress?.street || ''}</p>
              <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.district || ''}</p>
              <p>${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}</p>
              <p>${order.shippingAddress?.country || ''}</p>
              <p>Phone: ${order.shippingAddress?.phone || ''}</p>
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 10px; text-align: left;">S.No</th>
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Size</th>
              <th style="padding: 10px; text-align: left;">Color</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Unit Price (₹)</th>
              <th style="padding: 10px; text-align: right;">Total (₹)</th>
             </tr>
          </thead>
          <tbody>
            ${order.orderItems?.map((item, index) => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">${index + 1}</td>
                <td style="padding: 8px;">${item.name}</td>
                <td style="padding: 8px;">${item.size || 'N/A'}</td>
                <td style="padding: 8px;">${item.color || 'N/A'}</td>
                <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right;">₹${item.price.toLocaleString()}</td>
                <td style="padding: 8px; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <table style="width: 300px; margin-left: auto;">
            <tbody>
              <tr><td style="padding: 5px;"><strong>Subtotal:</strong></td><td style="padding: 5px; text-align: right;">₹${(order.itemsPrice || 0).toLocaleString()}</td></tr>
              <tr><td style="padding: 5px;"><strong>Shipping:</strong></td><td style="padding: 5px; text-align: right;">₹${(order.shippingPrice || 0).toLocaleString()}</td></tr>
              <tr><td style="padding: 5px;"><strong>Tax (5%):</strong></td><td style="padding: 5px; text-align: right;">₹${(order.taxPrice || 0).toLocaleString()}</td></tr>
              ${order.discountAmount > 0 ? `<tr><td style="padding: 5px;"><strong>Discount:</strong></td><td style="padding: 5px; text-align: right;">-₹${(order.discountAmount || 0).toLocaleString()}</td></tr>` : ''}
              <tr style="border-top: 2px solid #000;"><td style="padding: 10px 5px;"><strong>TOTAL:</strong></td><td style="padding: 10px 5px; text-align: right; font-size: 18px; font-weight: bold;">₹${(order.totalPrice || 0).toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <h3>Payment Details</h3>
          <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Payment Status:</strong> ${order.isPaid ? 'Paid ✓' : 'Pending'}</p>
          ${order.paidAt ? `<p><strong>Paid On:</strong> ${new Date(order.paidAt).toLocaleDateString()}</p>` : ''}
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p>Thank you for shopping with us!</p>
          <p>For any queries, please contact support@fashionstore.com</p>
          <p>This is a computer generated invoice and does not require physical signature.</p>
        </div>
      </div>
    `;

    document.body.appendChild(invoiceElement);

    try {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice_${order._id}.pdf`);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate invoice');
    } finally {
      document.body.removeChild(invoiceElement);
    }
  };

  // SAME BUTTON STYLES AS OrderHistory.jsx for consistency
  const styles = {
    button: {
      padding: isMobile ? '10px 12px' : '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      minWidth: isMobile ? '70px' : '95px',
      height: isMobile ? '40px' : '44px',
      lineHeight: '1',
      transition: 'all 0.3s ease',
      backgroundColor: '#4f46e5',
      color: 'white',
    },
  };

  return (
    <button 
      onClick={generatePDF} 
      style={styles.button}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
    >
      📄 Inv
    </button>
  );
};

export default InvoicePDF;