import { Wallet, CreditCard, QrCode, Banknote } from "lucide-react";

const PaymentMethods = () => {
  const methods = [
    {
      icon: <Wallet className="text-primary h-8 w-8" />,
      title: "Ví điện tử",
      description: "MoMo, ZaloPay, VNPay, AirPay"
    },
    {
      icon: <CreditCard className="text-primary h-8 w-8" />,
      title: "Thẻ tín dụng",
      description: "Visa, Mastercard, JCB"
    },
    {
      icon: <QrCode className="text-primary h-8 w-8" />,
      title: "VietQR",
      description: "Thanh toán nhanh chóng qua ngân hàng"
    },
    {
      icon: <Banknote className="text-primary h-8 w-8" />,
      title: "Thanh toán khi nhận hàng",
      description: "COD an toàn tại nhà"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-4">Thanh toán dễ dàng & an toàn</h2>
        <p className="text-center text-neutral-800 max-w-2xl mx-auto mb-10">
          Chúng tôi hỗ trợ nhiều phương thức thanh toán an toàn và tiện lợi để bạn có trải nghiệm mua sắm tốt nhất.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {methods.map((method, index) => (
            <div key={index} className="bg-neutral-100 p-6 rounded-lg text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                {method.icon}
              </div>
              <h3 className="font-heading font-semibold mb-2">{method.title}</h3>
              <p className="text-sm text-neutral-800">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
