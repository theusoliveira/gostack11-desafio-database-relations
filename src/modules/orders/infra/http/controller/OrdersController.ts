import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import AppError from '@shared/errors/AppError';

export default class OrdersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id: orderId } = req.params;
    const findOrderService = container.resolve(FindOrderService);

    const existingOrder = await findOrderService.execute({
      id: orderId,
    });

    if (!existingOrder) {
      throw new AppError('Order not found.');
    }

    return res.status(200).json({
      ...existingOrder,
      order_products: existingOrder.order_products.map(original => ({
        ...original,
        price: original.price,
      })),
    });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { customer_id, products } = req.body;

    const createOrderService = container.resolve(CreateOrderService);

    const newOrder = await createOrderService.execute({
      customer_id,
      products,
    });

    return res.status(200).json({
      ...newOrder,
      order_products: newOrder.order_products.map(original => ({
        ...original,
        price: original.price,
      })),
    });
  }
}
