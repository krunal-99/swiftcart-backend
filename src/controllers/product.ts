import { Request, Response } from "express";
import { In } from "typeorm";
import { productsRepo } from "../utils/services";

export const getRandomProducts = async (req: Request, res: Response) => {
  try {
    const count = 8;
    const randomProducts = await productsRepo
      .createQueryBuilder("product")
      .orderBy("RANDOM()")
      .limit(count)
      .getMany();
    res.status(200).json({ status: "success", data: randomProducts });
  } catch (error) {
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getFilteredProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 9;
    const search = (req.query.search as string) || "";
    const categoryId = parseInt(req.query.category as string, 10) || 1;
    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice = parseFloat(req.query.maxPrice as string) || 1000000;
    const brands = req.query.brands
      ? (req.query.brands as string).split(",")
      : [];
    const sortBy = (req.query.sortBy as string) || "popularity";

    let query = productsRepo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.brand", "brand")
      .where("product.salePrice BETWEEN :minPrice AND :maxPrice", {
        minPrice,
        maxPrice,
      });

    if (search) {
      query = query.andWhere("product.title ILIKE :search", {
        search: `%${search}%`,
      });
    }

    if (categoryId > 1) {
      query = query.andWhere("brand.categoryId = :categoryId", { categoryId });
    }

    if (brands.length > 0) {
      query = query.andWhere("brand.name IN (:...brands)", { brands });
    }

    switch (sortBy) {
      case "price-low":
        query = query.orderBy("product.salePrice", "ASC");
        break;
      case "price-high":
        query = query.orderBy("product.salePrice", "DESC");
        break;
      case "name-asc":
        query = query.orderBy("product.title", "ASC");
        break;
      case "name-desc":
        query = query.orderBy("product.title", "DESC");
        break;
      default:
        query = query
          .orderBy("product.rating", "DESC")
          .addOrderBy("product.reviewCount", "DESC");
    }
    const total = await query.getCount();

    query = query.skip((page - 1) * limit).take(limit);

    const products = await query.getMany();

    res.status(200).json({
      status: "success",
      data: {
        products,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getFilteredProducts:", error);
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getMaxProductPrice = async (req: Request, res: Response) => {
  try {
    const result = await productsRepo
      .createQueryBuilder("product")
      .select("MAX(product.salePrice)", "maxPrice")
      .getRawOne();

    const maxPrice = Math.ceil(result.maxPrice || 100000);

    res.status(200).json({ status: "success", data: maxPrice });
  } catch (error) {
    console.error("Error in getMaxProductPrice:", error);
    res.status(400).json({ status: "failed", message: error });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const featured = await productsRepo.find({ where: { id: In([16, 67]) } });
    res.status(200).json({ status: "success", data: featured });
  } catch (error) {
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getAdvertisements = async (req: Request, res: Response) => {
  try {
    const adData = await productsRepo.find({ where: { id: In([46, 88]) } });
    res.status(200).json({ status: "success", data: adData });
  } catch (error) {
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productsRepo.find({
      where: { id: Number(id) },
      relations: ["reviews"],
    });
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "failed", data: error });
  }
};
