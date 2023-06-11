using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Utility
{
    public class Helper
    {
        public static string FirstCharToUpper(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return input;
            }
            return input.First().ToString().ToUpper() + String.Join("", input.Skip(1));
        }       

        public static DateTime GetSafeDate(DateTime? date)
        {
            DateTime dt = new DateTime();
            if (date.HasValue)
            {
                dt = date.Value;
            }
            else
            {
                dt = DateTime.MinValue;
            }
            return dt;
        }

        private static String[] units = { "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
            "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };

        private static String[] tens = { "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

        public static String ConvertAmount(double amount)
        {
            Int64 amount_int = (Int64)amount;
            Int64 amount_dec = (Int64)Math.Round((amount - (double)(amount_int)) * 100);
            if (amount_dec == 0)
            {
                return Convert(amount_int);
            }
            else
            {
                return Convert(amount_int) + " Point " + Convert(amount_dec);
            }
        }

        public static String Convert(Int64 i)
        {
            if (i < 20)
            {
                return units[i];
            }
            if (i < 100)
            {
                return tens[i / 10] + ((i % 10 > 0) ? " " + Convert(i % 10) : "");
            }
            if (i < 1000)
            {
                return units[i / 100] + " Hundred"
                        + ((i % 100 > 0) ? " And " + Convert(i % 100) : "");
            }
            if (i < 100000)
            {
                return Convert(i / 1000) + " Thousand "
                + ((i % 1000 > 0) ? " " + Convert(i % 1000) : "");
            }
            if (i < 10000000)
            {
                return Convert(i / 100000) + " Lakh "
                        + ((i % 100000 > 0) ? " " + Convert(i % 100000) : "");
            }
            if (i < 1000000000)
            {
                return Convert(i / 10000000) + " Crore "
                        + ((i % 10000000 > 0) ? " " + Convert(i % 10000000) : "");
            }
            return Convert(i / 1000000000) + " Arab "
                    + ((i % 1000000000 > 0) ? " " + Convert(i % 1000000000) : "");
        }

        public static System.Text.StringBuilder ReadHtmlFile(string htmlFileNameWithPath)
        {
            System.Text.StringBuilder htmlContent = new System.Text.StringBuilder();
            string line;
            using (System.IO.StreamReader htmlReader = new System.IO.StreamReader(htmlFileNameWithPath))
            {

                while ((line = htmlReader.ReadLine()) != null)
                {
                    htmlContent.Append(line);
                }
            }
            return htmlContent;
        }                
        
        public static string GetFirstName(string email)
        {
            return NormalCase(email.Split('.')[0]);
        }

        public static string GetLastName(string email)
        {
            return NormalCase((email.Split('@')[0]).Split('.')[1]);
        }

        public static string NormalCase(string str)
        {
            return char.ToUpper(str[0]) + str.Substring(1);
        }
    }
}
