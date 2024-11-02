import Template from '../models/Template.js';
import Apierror from '../utils/Apierror.js';
import asynchandler from '../utils/Asynchandler.js';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';


export const saveTemplate = asynchandler(async (req, res) => {
  const { name, type, content } = req.body;

  if (!name || !type || !content) {
    throw new Apierror(400, 'Name, type, and content are required');
  }

  let template = await Template.findOne({ name, type });

  try {
    if (template) {
      template.content = content;
      await template.save(); 
      res.status(200).json({ success: true, data: template }); 
    } else {
      template = new Template({ name, type, content });
      await template.save(); 
      res.status(201).json({ success: true, data: template }); 
    }
  } catch (error) {
    throw new Apierror(500, 'Error saving the template');
  }
});


export const generatePDF = asynchandler(async (req, res) => {
  const { type } = req.params;  
  const data = req.body;        

  const template = await Template.findOne({ type });
  if (!template) {
    throw new Apierror(404, 'Template not found');
  }

  let htmlContent;

  if (data.items && Array.isArray(data.items)) {
    const totalAmount = data.items.reduce((sum, item) => sum + (item.netAmount || 0), 0);
    const totalDiscount = data.items.reduce((sum, item) => sum + (item.discount ? (item.discount / 100) * (item.netAmount || 0) : 0), 0);
    const netAmount = totalAmount - totalDiscount; 

    const compiledTemplate = handlebars.compile(template.content);
    htmlContent = compiledTemplate({
      title: data.title,        
      items: data.items,        
      totalAmount: totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }),
      totalDiscount: totalDiscount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }),
      netAmount: netAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }),
    });
  } else {
    const netAmount = data.netAmount - (data.discount ? (data.discount / 100) * data.netAmount : 0); 
    const compiledTemplate = handlebars.compile(template.content);
    htmlContent = compiledTemplate({
      title: data.title,         
      item: data,                
      netAmount: netAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }), 
    });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '10px', right: '10px' },
  });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${type}.pdf`);
  res.send(pdfBuffer);
});


export const exportCSV = asynchandler(async (req, res) => {
  const { type } = req.params;  
  const data = req.body;        

  const template = await Template.findOne({ type });
  if (!template) {
    throw new Apierror(404, 'Template not found');
  }

  let csvData;

  if (data.items && Array.isArray(data.items)) {
    csvData = data.items.map(item => ({
      number: item.number,
      date: item.date,
      customer: item.customer,
      reference: item.reference,
      order: item.order,
      dueDate: item.dueDate,
      netAmount: item.netAmount,
      discount: item.discount || 0, 
      netAmountAfterDiscount: item.netAmount - (item.discount ? (item.discount / 100) * item.netAmount : 0),
    }));
  } else {
    csvData = [{
      number: data.number,
      date: data.date,
      customer: data.customer,
      reference: data.reference,
      order: data.order,
      dueDate: data.dueDate,
      netAmount: data.netAmount,
      discount: data.discount || 0,
      netAmountAfterDiscount: data.netAmount - (data.discount ? (data.discount / 100) * data.netAmount : 0),
    }];
  }

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(csvData);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${type}.csv`);
  res.send(csv);
});



